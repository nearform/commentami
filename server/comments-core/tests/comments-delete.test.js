'use strict'

const { beforeEach, test, teardown } = require('tap')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

const db = initPool(config.pg)
const commentsService = initCommentsService(db)

beforeEach((done) => resetDb(config.pg, done))

test('Comments: delete one comment', function (t) {
  const comment = {
    reference: 'uuid-of-some-sort',
    content: 'lorm ipsum ....',
    author: 'Filippo'
  }

  return commentsService.add(comment)
    .then(() => {
      return commentsService.delete(1)
        .then((result) => {
          t.ok(result, 'result is empty')

          const expected = { success: true }
          t.same(result, expected, 'result is not as expected')
          t.end()
        })
    })
})

test('Comments: deleting a non existed objecct will return success', function (t) {
  return commentsService.delete(123)
    .then((result) => {
      t.ok(result, 'result is empty')

      const expected = { success: true }
      t.same(result, expected, 'result is not as expected')
      t.end()
    })
})

test('Comments: deleting without reference return success', function (t) {
  return commentsService.delete(null)
    .then((result) => {
      t.ok(result, 'result is empty')

      const expected = { success: true }
      t.same(result, expected, 'result is not as expected')
      t.end()
    })
})

teardown(() => db.end())
