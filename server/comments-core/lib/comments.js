'use strict'

const _ = require('lodash')
const SQL = require('@nearform/sql')

module.exports = function build (db) {
  return { add }

  function add (data, done) {
    const { reference, comment, author } = data
    db.query(SQL`
      INSERT INTO
        comment (reference, comment, author)
      VALUES (${reference}, ${comment}, ${author})
      RETURNING *
    `, (err, res) => {
      if (err) return done(err)

      done(null, _.get(res, 'rows.0'))
    })
  }
}
