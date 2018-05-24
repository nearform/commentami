'use strict'

const async = require('async')
const tap = require('tap')
const faker = require('faker')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

const reference = faker.random.uuid()
const comments = (new Array(20)).fill(null).map(v => {
  return {
    reference: reference,
    content: faker.lorem.words(),
    author: faker.name.firstName()
  }
})

const db = initPool(config.pg)
const commentsService = initCommentsService(db)

tap.beforeEach((done) => {
  resetDb(config.pg, (err) => {
    if (err) return done(err)

    async.series(comments.map(comment => (next) => commentsService.add(comment, next)), done)
  })
})

tap.test('Comments: list all comments will return 10 by default', function (t) {
  commentsService.list(reference, (err, list) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(list, 'list is empty')

    t.equal(list.length, 10, 'list is not 10 long')
    t.end()
  })
})

tap.test('Comments: can ask for comments using limits and offset', function (t) {
  commentsService.list(reference, { limit: 15, offset: 3 }, (err, list) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(list, 'list is empty')

    t.equal(list.length, 15, 'list is not 15 long')
    t.equal(list[0].id, 4, 'list should start from 4')
    t.end()
  })
})

tap.teardown(() => db.end())
