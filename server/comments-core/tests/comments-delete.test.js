'use strict'

const tap = require('tap')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

const db = initPool(config.pg)
const commentsService = initCommentsService(db)

tap.beforeEach((done) => resetDb(config.pg, done))

tap.test('Comments: delete one comment', function (t) {
  const comment = {
    reference: 'uuid-of-some-sort',
    content: 'lorm ipsum ....',
    author: 'Filippo'
  }

  commentsService.add(comment, (err) => {
    t.notOk(err, 'error returned when adding a comment')

    commentsService.delete(1, (err, result) => {
      t.notOk(err, 'error returned when adding a comment')
      t.ok(result, 'result is empty')

      const expected = { success: true }
      t.same(result, expected, 'result is not as expected')
      t.end()
    })
  })
})

tap.test('Comments: deleting a non existed objecct will return success', function (t) {
  commentsService.delete(123, (err, result) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(result, 'result is empty')

    const expected = { success: true }
    t.same(result, expected, 'result is not as expected')
    t.end()
  })
})

tap.test('Comments: deleting without reference return success', function (t) {
  commentsService.delete(null, (err, result) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(result, 'result is empty')

    const expected = { success: true }
    t.same(result, expected, 'result is not as expected')
    t.end()
  })
})

tap.teardown(() => db.end())
