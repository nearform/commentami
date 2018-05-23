'use strict'

const _ = require('lodash')
const SQL = require('@nearform/sql')

function mapCommentFromDb (comment) {
  if (!comment) return null

  return _.pick(comment, ['id', 'reference', 'comment', 'author'])
}

module.exports = function buildCommentsService (db) {
  return { add, update, delete: deleteComment, list }

  function add (data, done) {
    const { reference, comment, author } = data
    db.query(SQL`
      INSERT INTO
        comment (reference, comment, author)
      VALUES (${reference}, ${comment}, ${author})
      RETURNING *
    `, (err, res) => {
      if (err) return done(err)

      done(null, mapCommentFromDb(_.get(res, 'rows.0')))
    })
  }

  function update (id, data, done) {
    const { comment } = data

    if (!comment) {
      return getComment(id, done)
    }

    db.query(SQL`
      UPDATE
        comment
      SET
        comment = ${comment}
      WHERE
        id = ${id}
      RETURNING *
    `, (err, res) => {
      if (err) return done(err)

      done(null, mapCommentFromDb(_.get(res, 'rows.0')))
    })
  }

  function deleteComment (id, done) {
    if (!id) {
      return done(null, { success: true })
    }

    db.query(SQL`DELETE FROM comment WHERE id = ${id}`, (err, res) => {
      if (err) return done(err)

      done(null, { success: true })
    })
  }

  function getComment (id, done) {
    db.query(SQL` SELECT * FROM comment WHERE id = ${id}`, (err, res) => {
      if (err) return done(err)

      done(null, mapCommentFromDb(_.get(res, 'rows.0')))
    })
  }

  function list (reference, options, done) {
    if (_.isFunction(options)) {
      done = options
      options = {}
    }

    const { limit = 10, offset = 0 } = options

    const sql = SQL`
      SELECT
        *
      FROM
        comment
      WHERE
        reference = ${reference}
      LIMIT ${limit} OFFSET ${offset}
    `

    db.query(sql, (err, res) => {
      console.error(err)
      if (err) return done(err)
      if (res.rowCount === 0) return done(null, [])

      done(null, res.rows.map(mapCommentFromDb))
    })
  }
}
