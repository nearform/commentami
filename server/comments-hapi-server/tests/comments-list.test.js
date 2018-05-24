'use strict'

const tap = require('tap')
const faker = require('faker')

const { setupServer } = require('../server.js')

const config = require('../../comments-core/config')
const resetDb = require('../../comments-core/tests/reset-db')
const loadComments = require('../../comments-core/tests/load-comments')

const reference = faker.random.uuid()

tap.beforeEach((done) => resetDb(config.pg, (err) => {
  if (err) return done(err)

  loadComments({ reference }, (err) => {
    if (err) return done(err)
    done()
  })
}))

tap.test('Comments GET: list comments', async function (t) {
  const server = await setupServer()
  const request = {
    method: 'GET',
    url: `/comments?reference=${reference}&limit=10&offset=5`
  }
  let response = await server.inject(request)

  t.ok(response.result, 'response should not be empty')
  t.match(response.result, {
    total: 20,
    limit: 10,
    offset: 5
  })
  t.equal(response.result.comments.length, 10, 'response.comments should be 10')
  t.equal(response.result.comments[0].id, 6, 'comments should start from the 6th')

  return server.stop()
})
