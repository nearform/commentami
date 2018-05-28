'use strict'

const { isObject } = require('lodash')
const SQL = require('@nearform/sql')

module.exports = function buildCommentsService(db) {
  function mapCommentFromDb(raw) {
    if (!raw) return null

    const { id, url, reference, content, author } = raw
    return { id, url, reference, content, author }
  }
  async function closeDatabase() {
    return db.end()
  }

  async function addComment({ reference, content, author, url }) {
    const sql = SQL`
      INSERT INTO
        comment (url, reference, content, author)
      VALUES (${url}, ${reference}, ${content}, ${author})
      RETURNING *
    `

    const res = await db.query(sql)

    return mapCommentFromDb(res.rows[0])
  }

  async function getComment(id) {
    const sql = SQL` SELECT * FROM comment WHERE id = ${id}`

    const res = await db.query(sql)
    if (res.rowCount === 0) throw new Error(`Cannot find comment with id ${id}`)

    return mapCommentFromDb(res.rows[0])
  }

  async function updateComment(id, { content }) {
    if (!content) {
      return getComment(id)
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

    return mapCommentFromDb(res.rows[0])
  }

  async function deleteComment(id) {
    if (!id) {
      return { success: true }
    }

    const sql = SQL`DELETE FROM comment WHERE id = ${id}`
    await db.query(sql)
    return { success: true }
  }

  async function listComments(url, reference = null, options = {}) {
    if (isObject(reference)) {
      options = reference
      reference = null
    }

    const { limit = 100, offset = 0 } = options
    const sqlCount = SQL`
      SELECT
        COUNT(*)
      FROM
        comment
      WHERE
        url = ${url}
    `
    const sqlFilter = SQL`
      SELECT
        *
      FROM
        comment
      WHERE
        url = ${url}
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
    return {
      comments: filterRes.rows.map(mapCommentFromDb),
      total: parseInt(countRes.rows[0].count, 0),
      limit,
      offset
    }
  }

  return {
    db,
    close: closeDatabase,
    add: addComment,
    get: getComment,
    update: updateComment,
    delete: deleteComment,
    list: listComments,
    mapCommentFromDb
  }
}
