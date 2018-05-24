'use strict'

const tap = require('tap')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

const db = initPool(config.pg)
const commentsService = initCommentsService(db)

tap.beforeEach((done) => resetDb(config.pg, done))

tap.test('Comments: add a comment', function (t) {
  const comment = {
    reference: 'uuid-of-some-sort',
    content: 'lorm ipsum ....',
    author: 'Filippo'
  }

  commentsService.add(comment, (err, result) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(result, 'result is empty')

    const expected = {
      id: 1,
      reference: 'uuid-of-some-sort',
      content: 'lorm ipsum ....',
      author: 'Filippo'
    }
    t.same(result, expected, 'result is not as expected')
    t.end()
  })
})

tap.teardown(() => db.end())
