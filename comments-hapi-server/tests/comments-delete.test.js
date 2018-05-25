'use strict'

const { beforeEach, test, teardown } = require('tap')

const { getServer, stopServer, resetDb } = require('./utils')

beforeEach(() => resetDb())

test('Comments DELETE: a comment', async function (t) {
  const server = await getServer()

  const postRequest = {
    method: 'POST',
    url: '/comments',
    payload: {
      reference: 'some/kind:of/reference',
      content: 'my special comment',
      author: 'me'
    }
  }
  let response = await server.inject(postRequest)
  t.match(response.result, {
    reference: 'some/kind:of/reference',
    content: 'my special comment',
    author: 'me'
  }, 'comment does not match request')

  const id = response.result.id
  const deleteRequest = {
    method: 'DELETE',
    url: `/comments/${id}`
  }
  response = await server.inject(deleteRequest)
  t.equal(response.statusCode, 200, 'status code should be 200')
})

teardown(() => stopServer())
