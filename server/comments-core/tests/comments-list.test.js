'use strict'

const { beforeEach, test, teardown } = require('tap')
const faker = require('faker')

const loadComments = require('./load-comments')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

const db = initPool(config.pg)
const commentsService = initCommentsService(db)

const reference = faker.random.uuid()

beforeEach(async () => {
  await resetDb(config.pg)
  await loadComments({ reference })
})

test('Comments: list all comments will return 100 by default', async function (t) {
  const list = await commentsService.list(reference)

  t.ok(list, 'list is empty')
  t.match(list, {
    total: 20,
    limit: 100,
    offset: 0
  })
  t.equal(list.comments.length, 20, 'list is not 100 long')
})

test('Comments: can ask for comments using limits and offset', async function (t) {
  const list = await commentsService.list(reference, { limit: 15, offset: 3 })

  t.ok(list, 'list is empty')
  t.match(list, {
    total: 20,
    limit: 15,
    offset: 3
  })
  t.equal(list.comments.length, 15, 'list.comments is not 15 long')
  t.equal(list.comments[0].id, 4, 'list.comments should start from 4')
})

teardown(() => db.end())
