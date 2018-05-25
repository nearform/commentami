'use strict'

const { beforeEach, test, teardown } = require('tap')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

const db = initPool(config.pg)
const commentsService = initCommentsService(db)

beforeEach(() => resetDb(config.pg))

test('Comments: update one comment', async function (t) {
  const comment = {
    reference: 'uuid-of-some-sort',
    content: 'lorm ipsum ....',
    author: 'Filippo'
  }
  const commentUpdate = {
    content: 'new comment'
  }
  const expected = {
    id: 1,
    reference: 'uuid-of-some-sort',
    content: 'new comment',
    author: 'Filippo'
  }

  await commentsService.add(comment)
  const result = await commentsService.update(1, commentUpdate)

  t.ok(result, 'result is empty')
  t.same(result, expected, 'result is not as expected')
})

test('Comments: update one comment with an empty string is not possible', async function (t) {
  const comment = {
    reference: 'uuid-of-some-sort',
    content: 'lorm ipsum ....',
    author: 'Filippo'
  }
  const commentUpdate = {
    content: ''
  }
  const expected = {
    id: 1,
    reference: 'uuid-of-some-sort',
    content: 'lorm ipsum ....',
    author: 'Filippo'
  }

  await commentsService.add(comment)
  const result = await commentsService.update(1, commentUpdate)

  t.ok(result, 'result is empty')
  t.same(result, expected, 'result is not as expected')
})

teardown(() => db.end())
