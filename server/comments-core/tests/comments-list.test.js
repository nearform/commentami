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

tap.beforeEach((done) => {
  resetDb(config.pg, (err) => {
    if (err) return done(err)

    const db = initPool(config.pg)
    const commentsService = initCommentsService(db)

    const inserts = comments.map(comment => {
      return (next) => commentsService.add(comment, next)
    })

    async.series(
      inserts,
      (err) => {
        if (err) return done(err)

        db.end()
          .then(() => done())
          .catch((err) => done(err))
      }
    )
  })
})

tap.test('Comments: list all comments will return 10 by default', function (t) {
  const db = initPool(config.pg)
  const commentsService = initCommentsService(db)

  commentsService.list(reference, (err, list) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(list, 'list is empty')

    t.equal(list.length, 10, 'list is not 10 long')
    db.end()
      .then(() => t.end())
      .catch((err) => t.end(err))
  })
})
