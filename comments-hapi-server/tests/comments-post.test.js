'use strict'

const { beforeEach, test, teardown } = require('tap')

const { getServer, stopServer, resetDb } = require('./utils')

beforeEach(() => resetDb())

test('Comments POST: add a comment', async function (t) {
  const request = {
    method: 'POST',
    url: '/comments',
    payload: {
      reference: 'some/kind:of/reference',
      content: 'my special comment',
      author: 'me'
    }
  }

  const server = await getServer()
  const response = await server.inject(request)

  t.match(response.result, {
    reference: 'some/kind:of/reference',
    content: 'my special comment',
    author: 'me'
  }, 'comment does not match request')
})

teardown(() => stopServer())
