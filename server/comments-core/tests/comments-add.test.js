'use strict'

const tap = require('tap')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')

tap.beforeEach((done) => resetDb(config.pg, done))

tap.test('Comments: add a comment', function (t) {
  const db = initPool(config.pg)
  const comments = require('../lib/comments')(db)
  const comment = {
    reference: 'uuid-of-some-sort',
    content: 'lorm ipsum ....',
    author: 'Filippo'
  }

  comments.add(comment, (err, result) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(result, 'result is empty')

    const expected = {
      id: 1,
      reference: 'uuid-of-some-sort',
      content: 'lorm ipsum ....',
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
