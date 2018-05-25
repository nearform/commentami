'use strict'

const { expect } = require('code')
const Lab = require('lab')
const { random, lorem, name } = require('faker')

module.exports.lab = Lab.script()
const { describe, it: test, before, after, beforeEach } = module.exports.lab

const testServer = require('./test-server')

describe('Comments REST API', () => {
  let server = null

  before(async () => {
    server = await testServer.buildDefault()
  })

  after(async () => {
    return testServer.stopAll()
  })

  describe('GET /comments', () => {
    beforeEach(() => {
      this.reference = random.uuid()

      const comments = new Array(20).fill(0).map(v => ({
        reference: this.reference,
        content: lorem.words(),
        author: name.firstName()
      }))

      return Promise.all(comments.map(comment => server.commentsService.add(comment)))
    })

    test('it should search comments and return them with 200', async () => {
      const all = await server.commentsService.list(this.reference)

      const response = await server.inject({
        method: 'GET',
        url: `/comments?reference=${this.reference}&limit=3&offset=5`
      })

      expect(response.statusCode).to.equal(200)
      const result = JSON.parse(response.payload)

      expect(result).to.include({
        total: 20,
        limit: 3,
        offset: 5
      })

      expect(result.comments.length).to.equal(3)
      expect(result.comments[0].id).to.equal(all.comments[5].id)
    })
  })

  describe('POST /comments', () => {
    test('it should create a comment', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/comments',
        payload: {
          reference: 'UUID',
          content: 'MESSAGE',
          author: 'AUTHOR'
        }
      })

      expect(response.statusCode).to.equal(200)
      const result = JSON.parse(response.payload)

      expect(result).to.include({
        reference: 'UUID',
        content: 'MESSAGE',
        author: 'AUTHOR'
      })
    })
  })

  describe('GET /comments/{id}', () => {
    test('it should retrieve a comment', async () => {
      const created = await server.commentsService.add({
        reference: 'OLD-UUID',
        content: 'OLD-MESSAGE',
        author: 'OLD-AUTHOR'
      })

      const response = await server.inject({
        method: 'GET',
        url: `/comments/${created.id}`
      })

      expect(response.statusCode).to.equal(200)
      const result = JSON.parse(response.payload)

      expect(result).to.equal(created)
    })
  })

  describe('PUT /comments/{id}', () => {
    test('it should update a comment', async () => {
      const created = await server.commentsService.add({
        reference: 'OLD-UUID',
        content: 'OLD-MESSAGE',
        author: 'OLD-AUTHOR'
      })

      const response = await server.inject({
        method: 'PUT',
        url: `/comments/${created.id}`,
        payload: {
          content: 'MESSAGE'
        }
      })

      expect(response.statusCode).to.equal(200)
      const result = JSON.parse(response.payload)

      expect(result).to.include({
        id: created.id,
        reference: 'OLD-UUID',
        content: 'MESSAGE',
        author: 'OLD-AUTHOR'
      })
    })
  })

  describe('DELETE /comments/{id}', () => {
    test('it should delete a comment', async () => {
      const created = await server.commentsService.add({
        reference: 'OLD-UUID',
        content: 'OLD-MESSAGE',
        author: 'OLD-AUTHOR'
      })

      const response = await server.inject({
        method: 'DELETE',
        url: `/comments/${created.id}`
      })

      expect(response.statusCode).to.equal(200)
      const result = JSON.parse(response.payload)

      expect(result).to.equal({ success: true })
    })
  })
})
