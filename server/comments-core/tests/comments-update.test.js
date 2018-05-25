'use strict'

const { beforeEach, test, teardown } = require('tap')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

const db = initPool(config.pg)
const commentsService = initCommentsService(db)

beforeEach(() => resetDb(config.pg))

test('Comments: update one comment', function (t) {
  const comment = {
    reference: 'uuid-of-some-sort',
    content: 'lorm ipsum ....',
    author: 'Filippo'
  }
  const commentUpdate = {
    content: 'new comment'
  }

  return commentsService.add(comment)
    .then(() => {
      return commentsService.update(1, commentUpdate)
        .then((result) => {
          t.ok(result, 'result is empty')
          const expected = {
            id: 1,
            reference: 'uuid-of-some-sort',
            content: 'new comment',
            author: 'Filippo'
          }
          t.same(result, expected, 'result is not as expected')
        })
    })
})

test('Comments: update one comment with an empty string is not possible', function (t) {
  const comment = {
    reference: 'uuid-of-some-sort',
    content: 'lorm ipsum ....',
    author: 'Filippo'
  }
  const commentUpdate = {
    content: ''
  }

  return commentsService.add(comment)
    .then(() => {
      return commentsService.update(1, commentUpdate)
        .then((result) => {
          t.ok(result, 'result is empty')
          const expected = {
            id: 1,
            reference: 'uuid-of-some-sort',
            content: 'lorm ipsum ....',
            author: 'Filippo'
          }
          t.same(result, expected, 'result is not as expected')
        })
    })
})

teardown(() => db.end())
