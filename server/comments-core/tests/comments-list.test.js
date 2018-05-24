'use strict'

const tap = require('tap')
const faker = require('faker')

const loadComments = require('./load-comments')

const config = require('../config')
const resetDb = require('./reset-db')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

const db = initPool(config.pg)
const commentsService = initCommentsService(db)

const reference = faker.random.uuid()
let loaded = false

tap.beforeEach((done) => {
  if (loaded) return done()

  resetDb(config.pg, (err) => {
    if (err) return done(err)

    loadComments({ reference }, (err) => {
      if (err) return done(err)
      done()

      loaded = true
    })
  })
})

tap.test('Comments: list all comments will return 100 by default', function (t) {
  return commentsService.list(reference)
    .then((list) => {
      t.ok(list, 'list is empty')
      t.match(list, {
        total: 20,
        limit: 100,
        offset: 0
      })
      t.equal(list.comments.length, 20, 'list is not 100 long')
    })
})

tap.test('Comments: can ask for comments using limits and offset', function (t) {
  return commentsService.list(reference, { limit: 15, offset: 3 })
    .then((list) => {
      t.ok(list, 'list is empty')
      t.match(list, {
        total: 20,
        limit: 15,
        offset: 3
      })
      t.equal(list.comments.length, 15, 'list.comments is not 15 long')
      t.equal(list.comments[0].id, 4, 'list.comments should start from 4')
    })
})

tap.teardown(() => db.end())
