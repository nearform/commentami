'use strict'

const tap = require('tap')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')

tap.beforeEach((done) => resetDb(config.pg, done))

tap.test('Comments: delete one comment', function (t) {
  const db = initPool(config.pg)
  const comments = require('../lib/comments')(db)

  const comment = {
    reference: 'uuid-of-some-sort',
    comment: 'lorm ipsum ....',
    author: 'Filippo'
  }

  comments.add(comment, (err) => {
    t.notOk(err, 'error returned when adding a comment')

    comments.delete(1, (err, result) => {
      t.notOk(err, 'error returned when adding a comment')
      t.ok(result, 'result is empty')

      const expected = { success: true }
      t.same(result, expected, 'result is not as expected')

      db.end()
        .then(() => t.end())
        .catch((err) => {
          throw err
        })
    })
  })
})

tap.test('Comments: deleting a non existed objecct will return success', function (t) {
  const db = initPool(config.pg)
  const comments = require('../lib/comments')(db)

  comments.delete(123, (err, result) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(result, 'result is empty')

    const expected = { success: true }
    t.same(result, expected, 'result is not as expected')

    db.end()
      .then(() => t.end())
      .catch((err) => {
        throw err
      })
  })
})

tap.test('Comments: deleting without reference return success', function (t) {
  const db = initPool(config.pg)
  const comments = require('../lib/comments')(db)

  comments.delete(null, (err, result) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(result, 'result is empty')

    const expected = { success: true }
    t.same(result, expected, 'result is not as expected')

    db.end()
      .then(() => t.end())
      .catch((err) => {
        throw err
      })
  })
})
