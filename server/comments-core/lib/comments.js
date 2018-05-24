'use strict'

const _ = require('lodash')
const SQL = require('@nearform/sql')

function mapCommentFromDb (comment) {
  if (!comment) return null

  return _.pick(comment, ['id', 'reference', 'content', 'author'])
}

module.exports = function buildCommentsService (db) {
  return { add, update, delete: deleteComment, list }

  function add (data, done) {
    const { reference, content, author } = data
    db.query(SQL`
      INSERT INTO
        comment (reference, content, author)
      VALUES (${reference}, ${content}, ${author})
      RETURNING *
    `, (err, res) => {
      if (err) return done(err)

      done(null, mapCommentFromDb(_.get(res, 'rows.0')))
    })
  }

  function update (id, data, done) {
    const { content } = data

    if (!content) {
      return getComment(id, done)
    }

    db.query(SQL`
      UPDATE
        comment
      SET
        content = ${content}
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
      if (err) return done(err)
      if (res.rowCount === 0) return done(null, [])

      done(null, res.rows.map(mapCommentFromDb))
    })
  }
}
