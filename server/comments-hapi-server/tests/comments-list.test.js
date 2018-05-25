'use strict'

const { beforeEach, test, teardown } = require('tap')
const faker = require('faker')

const { getServer, stopServer, resetDb, loadComments } = require('./utils')

const reference = faker.random.uuid()
let server

beforeEach(async () => {
  server = await getServer()
  await resetDb()
  await loadComments({ reference })
})

test('Comments GET: list comments', async function (t) {
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
})

test('Comments GET: list comments', async function (t) {
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
})

teardown(() => stopServer())
