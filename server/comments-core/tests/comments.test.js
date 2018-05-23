'use strict'

const tap = require('tap')

const config = require('../config')
const resetDb = require('./reset-db')
const { initDb } = require('../lib/db')

tap.beforeEach((done) => resetDb(config.pg, done))

tap.test('Comments (our own db and config): adding a comment will trigger the addedComment hook', function (t) {
  const db = initDb(config.pg)
  const comments = require('../lib/comments')(db)
  const comment = {
    reference: 'uuid-of-some-sort',
    comment: 'lorm ipsum ....',
    author: 'Filippo'
  }

  comments.add(comment, (err, result) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(result, 'result is empty')

    const expected = {
      id: 1,
      reference: 'uuid-of-some-sort',
      comment: 'lorm ipsum ....',
      author: 'Filippo'
    }
    t.same(result, expected, 'result is not as expected')

    db.end()
      .then(() => t.end())
      .catch((err) => {
        throw err
      })
  })
})

tap.test('Comments (passed custom configuration): will throw an error when the passed config is wrong', function (t) {
  const db = initDb({
    user: 'noexists',
    host: 'localhost',
    database: 'comments',
    password: 'noexists',
    port: 5432
  })

  const comments = require('../lib/comments')(db)
  const comment = {
    reference: 'uuid-of-some-sort',
    comment: 'lorm ipsum ....',
    author: 'Filippo'
  }

  comments.add(comment, (err, result) => {
    t.ok(err, 'should be gettig an error')
    t.notOk(result, 'result should be empty')

    db.end()
      .then(() => t.end())
      .catch((err) => {
        throw err
      })
  })
})

tap.test('Comments (passed connection): adding a comment will trigger the addedComment hook', function (t) {
  const { Pool } = require('pg')
  const pool = new Pool(config.pg)

  const comments = require('../lib/comments')(pool)
  const comment = {
    reference: 'uuid-of-some-sort',
    comment: 'lorm ipsum ....',
    author: 'Filippo'
  }

  comments.add(comment, (err, result) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(result, 'result is empty')

    const expected = {
      id: 1,
      reference: 'uuid-of-some-sort',
      comment: 'lorm ipsum ....',
      author: 'Filippo'
    }
    t.same(result, expected, 'result is not as expected')

    pool.end()
      .then(() => t.end())
      .catch((err) => {
        throw err
      })
  })
})
