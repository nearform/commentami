'use strict'

const tap = require('tap')

const { setupServer } = require('../server.js')

const config = require('../../comments-core/config')
const resetDb = require('../../comments-core/tests/reset-db')
tap.beforeEach((done) => resetDb(config.pg, done))

tap.test('Comments POST: add a comment', async function (t) {
  const request = {
    method: 'POST',
    url: '/comments',
    payload: {
      reference: 'some/kind:of/reference',
      content: 'my special comment',
      author: 'me'
    }
  }

  const server = await setupServer()
  const response = await server.inject(request)

  t.match(response.result, {
    reference: 'some/kind:of/reference',
    content: 'my special comment',
    author: 'me'
  }, 'comment does not match request')

  return server.stop()
})
