'use strict'

const { pick, get } = require('lodash')
const SQL = require('@nearform/sql')

function mapCommentFromDb (comment) {
  if (!comment) return null

  return pick(comment, ['id', 'reference', 'content', 'author'])
}

module.exports = function buildCommentsService (db) {
  return { add, update, delete: deleteComment, list, close }

  function close () {
    return db.end()
  }

  function add (data) {
    const { reference, content, author } = data
    const sql = SQL`
      INSERT INTO
        comment (reference, content, author)
      VALUES (${reference}, ${content}, ${author})
      RETURNING *
    `

    return db.query(sql).then((res) => {
      return mapCommentFromDb(get(res, 'rows.0'))
    })
  }

  function update (id, data) {
    const { content } = data

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

    return db.query(sql).then((res) => {
      if (res.rowCount === 0) {
        throw new Error(`Cannot fine comment with id ${id}`)
      }

      return mapCommentFromDb(get(res, 'rows.0'))
    })
  }

  function deleteComment (id) {
    if (!id) {
      return Promise.resolve({ success: true })
    }

    const sql = SQL`DELETE FROM comment WHERE id = ${id}`

    return db.query(sql).then(() => ({ success: true }))
  }

  function getComment (id) {
    const sql = SQL` SELECT * FROM comment WHERE id = ${id}`

    return db.query(sql).then((res) => {
      if (!get(res, 'rows.0')) {
        throw new Error(`Cannot fine comment with id ${id}`)
      }

      return mapCommentFromDb(get(res, 'rows.0'))
    })
  }

  function list (reference, options = {}) {
    const { limit = 100, offset = 0 } = options
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
      LIMIT ${limit} OFFSET ${offset}
    `

    return Promise.all([db.query(sqlCount), db.query(sqlFilter)]).then((res) => {
      const [countRes, filterRes] = res

      return {
        comments: get(filterRes, 'rows', []).map(mapCommentFromDb),
        total: get(countRes, 'rows.0.count', 0),
        limit,
        offset
      }
    })
  }
}
