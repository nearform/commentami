'use strict'

const EventEmitter = require('events')
const { isObject } = require('lodash')
const SQL = require('@nearform/sql')

module.exports = function buildCommentsService(db, hooks = {}) {
  const { fetchedComment, fetchedComments } = hooks

  class CommentsService extends EventEmitter {
    mapCommentFromDb(raw) {
      if (!raw) return null

      const { id, resource, reference, content, author, created_at: createdAt } = raw

      return { id, resource, reference, content, author, createdAt }
    }

    async close() {
      return db.end()
    }

    async add({ reference, content, author, resource }) {
      const sql = SQL`
        INSERT INTO
          comment (resource, reference, content, author)
        VALUES (${resource}, ${reference}, ${content}, ${author})
        RETURNING *
      `

      const res = await db.query(sql)

      let comment = this.mapCommentFromDb(res.rows[0])
      comment = fetchedComment ? await fetchedComment(comment) : comment

      this.emit('add', comment)

      return comment
    }

    async get(id) {
      const sql = SQL` SELECT * FROM comment WHERE id = ${id}`

      const res = await db.query(sql)
      if (res.rowCount === 0) throw new Error(`Cannot find comment with id ${id}`)

      let comment = this.mapCommentFromDb(res.rows[0])
      comment = fetchedComment ? await fetchedComment(comment) : comment

      return comment
    }

    async update(id, { content }) {
      if (!content) {
        return this.get(id)
      }

      const sql = SQL`
        UPDATE
          comment
        SET
          content = ${content}
        WHERE
          id = ${id}
        RETURNING *
      `

      const res = await db.query(sql)
      if (res.rowCount === 0) throw new Error(`Cannot find comment with id ${id}`)

      let comment = this.mapCommentFromDb(res.rows[0])
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
          *
        FROM
          comment
        WHERE
          resource = ${resource}
      `

      if (reference) {
        sqlCount.append(SQL` AND reference = ${reference}`)
        sqlFilter.append(SQL` AND reference = ${reference}`)
      }

      sqlFilter.append(SQL`
        ORDER BY id DESC
        LIMIT ${limit} OFFSET ${offset}
      `)

      const [countRes, filterRes] = await Promise.all([db.query(sqlCount), db.query(sqlFilter)])
      const comments = filterRes.rows.map(this.mapCommentFromDb)

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
  }

  return new CommentsService()
}
