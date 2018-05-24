'use strict'

const async = require('async')
const { beforeEach, test, teardown } = require('tap')
const faker = require('faker')

const { setupServer } = require('../server.js')

const config = require('../../comments-core/config')
const resetDb = require('../../comments-core/tests/reset-db')
const loadComments = require('../../comments-core/tests/load-comments')
const { getServer, stopServer } = require('./utils')

let loader = false
const reference = faker.random.uuid()

beforeEach((done) => {
  if (loader) return done()

  async.series(
    [
      (next) => resetDb(config.pg, next),
      (next) => loadComments({ reference }, next)
    ],
    (err) => {
      if (err) return done(err)
      loader = true

      done()
    }
  )
})

test('Comments GET: list comments', async function (t) {
  const server = await getServer()
  const request = {
    method: 'GET',
    url: `/comments?reference=${reference}`
  }
  let response = await server.inject(request)

  t.ok(response.result, 'response should not be empty')
  t.match(response.result, {
    total: 20,
    limit: 100,
    offset: 0
  })
  t.equal(response.result.comments.length, 20, 'response.comments should be 20')
  t.end()
})

test('Comments GET: list comments', async function (t) {
  const server = await getServer()
  const request = {
    method: 'GET',
    url: `/comments?reference=${reference}&limit=5&offset=15`
  }
  let response = await server.inject(request)

  t.ok(response.result, 'response should not be empty')
  t.match(response.result, {
    total: 20,
    limit: 5,
    offset: 15
  })
  t.equal(response.result.comments.length, 5, 'response.comments should be 20')
  t.equal(response.result.comments[0].id, 16, 'response.comments[0] should be the 16th comment')
  t.end()
})

teardown(() => stopServer())
