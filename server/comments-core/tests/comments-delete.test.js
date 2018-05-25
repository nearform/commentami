'use strict'

const { beforeEach, test, teardown } = require('tap')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

const db = initPool(config.pg)
const commentsService = initCommentsService(db)

beforeEach(() => resetDb(config.pg))

test('Comments: delete one comment', async function (t) {
  const comment = {
    reference: 'uuid-of-some-sort',
    content: 'lorm ipsum ....',
    author: 'Filippo'
  }
  const expected = { success: true }

  await commentsService.add(comment)
  const result = await commentsService.delete(1)

  t.ok(result, 'result is empty')
  t.same(result, expected, 'result is not as expected')
  t.end()
})

test('Comments: deleting a non existed objecct will return success', async function (t) {
  const expected = { success: true }
  const result = await commentsService.delete(123)

  t.ok(result, 'result is empty')
  t.same(result, expected, 'result is not as expected')
})

test('Comments: deleting without reference return success', async function (t) {
  const expected = { success: true }
  const result = await commentsService.delete(null)

  t.ok(result, 'result is empty')
  t.same(result, expected, 'result is not as expected')
})

teardown(() => db.end())
