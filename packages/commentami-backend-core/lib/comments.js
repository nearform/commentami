'use strict'

const EventEmitter = require('events')
const { isObject } = require('lodash')
const SQL = require('@nearform/sql')
const mentions = require('./mentions')

async function transaction(db, task) {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    await task(client)
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

function normalizeComment(comment) {
  comment.author = { username: comment.author }
  if (comment.mentions && comment.mentions.length > 0) {
    comment.mentions = comment.mentions
      .map(mention => {
        return { username: mention }
      })
      .filter(v => !!v)
  }

  return comment
}

module.exports = function buildCommentsService(db, hooks = {}) {
  const { fetchedComment, fetchedComments, involvedUsers } = hooks

  class CommentsService extends EventEmitter {
    mapCommentFromDb(raw) {
      if (!raw) return null

      const { id, resource, reference, content, author, created_at: createdAt, mentions = [] } = raw

      return { id, resource, reference, content, author, createdAt, mentions: mentions.filter(v => !!v) }
    }

    async close() {
      return db.end()
    }

    async add({ reference, content, author, resource }) {
      let comment

      await transaction(db, async client => {
        const sqlComment = SQL`
          INSERT INTO
            comment (resource, reference, content, author)
          VALUES (${resource}, ${reference}, ${content}, ${author})
          RETURNING *
        `
        const res = await client.query(sqlComment)
        comment = this.mapCommentFromDb(res.rows[0])

        const mentionedUsers = mentions.parse(content)
        if (mentionedUsers.length > 0) {
          const sqlMentions = SQL`
            INSERT INTO
              mention (comment_id, mentioned)
            VALUES
          `
          mentionedUsers.forEach((mentionedUser, index) => {
            sqlMentions.append(SQL`(${comment.id}, ${mentionedUser})`)
            sqlMentions.append(index + 1 === mentionedUsers.length ? SQL`` : SQL`,`)
          })

          await client.query(sqlMentions)
        }
        comment.mentions = mentionedUsers
      })

      normalizeComment(comment)

      comment = fetchedComment ? await fetchedComment(comment) : comment

      this.emit('add', comment)

      return comment
    }

    async get(id) {
      const sql = SQL`
        SELECT
          c.*, array_agg(m.mentioned) as mentions
        FROM
          comment c
        LEFT JOIN
          mention m ON m.comment_id = c.id
        WHERE
          c.id = ${id}
        GROUP BY
          c.id
      `
      const res = await db.query(sql)
      if (res.rowCount === 0) throw new Error(`Cannot find comment with id ${id}`)

      let comment = this.mapCommentFromDb(res.rows[0])

      normalizeComment(comment)

      comment = fetchedComment ? await fetchedComment(comment) : comment

      return comment
    }

    async update(id, { content }) {
      if (!content) {
        return this.get(id)
      }

      let comment

      await transaction(db, async client => {
        const sqlComment = SQL`
          UPDATE
            comment
          SET
            content = ${content}
          WHERE
            id = ${id}
          RETURNING *
        `
        const res = await db.query(sqlComment)
        if (res.rowCount === 0) throw new Error(`Cannot find comment with id ${id}`)
        comment = this.mapCommentFromDb(res.rows[0])

        await client.query(`DELETE FROM mention WHERE comment_id = ${id}`)

        const mentionedUsers = mentions.parse(content)
        if (mentionedUsers.length > 0) {
          const sqlMentions = SQL`
            INSERT INTO
              mention (comment_id, mentioned)
            VALUES
          `
          mentionedUsers.forEach((mentionedUser, index) => {
            sqlMentions.append(SQL`(${id}, ${mentionedUser})`)
            sqlMentions.append(index + 1 === mentionedUsers.length ? SQL`` : SQL`,`)
          })

          await client.query(sqlMentions)

          comment.mentions = mentionedUsers
        }
      })

      normalizeComment(comment)

      comment = fetchedComment ? await fetchedComment(comment) : comment

      this.emit('update', comment)

      return comment
    }

    async delete(id) {
      let comment
      if (!id) {
        return
      }

      const selectSql = SQL`SELECT * FROM comment WHERE id = ${id}`
      const res = await db.query(selectSql)
      if (res.rowCount === 1) {
        comment = normalizeComment(res.rows[0])
        comment = fetchedComment ? await fetchedComment(res.rows[0]) : res.rows[0]

        const deleteSql = SQL`DELETE FROM comment WHERE id = ${id}`
        await db.query(deleteSql)
      }

      this.emit('delete', comment)

      return comment
    }

    async list(resource, reference = null, options = {}) {
      if (isObject(reference)) {
        options = reference
        reference = null
      }

      const { limit = 100, offset = 0 } = options

      if (!resource) {
        return {
          comments: [],
          total: 0,
          limit,
          offset
        }
      }

      const sqlCount = SQL`
        SELECT
          COUNT(*)
        FROM
          comment
        WHERE
          resource = ${resource}
      `
      const sqlFilter = SQL`
        SELECT
          c.*, array_agg(m.mentioned) as mentions
        FROM
          comment c
        LEFT JOIN
          mention m ON m.comment_id = c.id
        WHERE
          resource = ${resource}
      `

      if (reference) {
        sqlCount.append(SQL` AND reference = ${reference}`)
        sqlFilter.append(SQL` AND reference = ${reference}`)
      }

      sqlFilter.append(SQL`
        GROUP BY
          c.id
        ORDER BY
          id DESC
        LIMIT ${limit} OFFSET ${offset}
      `)

      const [countRes, filterRes] = await Promise.all([db.query(sqlCount), db.query(sqlFilter)])
      const comments = filterRes.rows.map(this.mapCommentFromDb).map(normalizeComment)

      return {
        comments: fetchedComments ? await fetchedComments(comments) : comments,
        total: parseInt(countRes.rows[0].count, 0),
        limit,
        offset
      }
    }

    async listOnlyReferences(resource) {
      const sql = SQL`
        SELECT
          DISTINCT(reference)
        FROM
          comment
        WHERE
          resource = ${resource}
      `

      const result = await db.query(sql)

      return {
        resource: resource,
        references: result.rows.map(item => item.reference)
      }
    }

    async getInvolvedUsers(comment) {
      const sql = SQL`
        SELECT
          DISTINCT(author)
        FROM
          comment c
        WHERE
          (c.reference, c.resource)
            IN (
              SELECT
                reference, resource
              FROM
                comment as c2
              WHERE
                c2.id = ${comment.id}
            )
      `

      const result = await db.query(sql)

      const authors = result.rows.map(comment => ({ username: comment.author }))
      return involvedUsers ? involvedUsers(authors) : authors
    }
  }

  return new CommentsService()
}
