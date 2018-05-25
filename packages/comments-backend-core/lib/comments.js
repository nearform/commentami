'use strict'

const SQL = require('@nearform/sql')

module.exports = function buildCommentsService(db) {
  function mapCommentFromDb(raw) {
    if (!raw) return null

    const { id, reference, content, author } = raw
    return { id, reference, content, author }
  }
  async function closeDatabase() {
    return db.end()
  }

  async function addComment({ reference, content, author }) {
    const sql = SQL`
      INSERT INTO
        comment (reference, content, author)
      VALUES (${reference}, ${content}, ${author})
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

  async function listComments(reference, { limit = 100, offset = 0 } = {}) {
    const sqlCount = SQL`
      SELECT
        COUNT(*)
      FROM
        comment
      WHERE
        reference = ${reference}
    `
    const sqlFilter = SQL`
      SELECT
        *
      FROM
        comment
      WHERE
        reference = ${reference}
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `

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
