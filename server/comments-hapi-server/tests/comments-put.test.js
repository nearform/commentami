'use strict'

const tap = require('tap')

const { setupServer } = require('../server.js')

const config = require('../../comments-core/config')
const resetDb = require('../../comments-core/tests/reset-db')
tap.beforeEach((done) => resetDb(config.pg, done))

tap.test('Comments PUT: update a comment', async function (t) {
  const server = await setupServer()

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
  const pustRequest = {
    method: 'PUT',
    url: `/comments/${id}`,
    payload: {
      content: 'UPDATED my special comment'
    }
  }
  response = await server.inject(pustRequest)
  t.match(response.result, {
    reference: 'some/kind:of/reference',
    content: 'UPDATED my special comment',
    author: 'me'
  }, 'comment does not match request')

  return server.stop()
})
