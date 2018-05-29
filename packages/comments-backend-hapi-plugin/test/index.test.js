'use strict'

const { expect } = require('code')
const Lab = require('lab')
const { random, lorem, name, internet } = require('faker')

module.exports.lab = Lab.script()
const { describe, it: test, before, after, beforeEach } = module.exports.lab

const { resetDb } = require('../../comments-backend-core/test/utils')
const buildServer = require('./test-server')

describe('Comments REST API', () => {
  let server = null

  before(async () => {
    await resetDb()
    server = await buildServer()
  })

  after(async () => {
    return server.stop()
  })

  describe('GET /comments', () => {
    beforeEach(() => {
      this.url = internet.url()
      this.reference = random.uuid()

      const comments = new Array(20).fill(0).map((v, i) => ({
        url: this.url,
        reference: i === 0 ? this.reference : random.uuid(),
        content: lorem.words(),
        author: name.firstName()
      }))

      return Promise.all(comments.map(comment => server.commentsService.add(comment)))
    })

    test('it should search comments by url and return them with 200', async () => {
      const all = await server.commentsService.list(this.url)

      const response = await server.inject({
        method: 'GET',
        url: `/comments?url=${this.url}&limit=3&offset=5`
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

    test('it should search comments by url and reference and return them with 200', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/comments?url=${this.url}&reference=${this.reference}&limit=3`
      })

      expect(response.statusCode).to.equal(200)
      const result = JSON.parse(response.payload)

      expect(result).to.include({
        total: 1,
        limit: 3,
        offset: 0
      })

      expect(result.comments.length).to.equal(1)
    })
  })

  describe('POST /comments', () => {
    test('it should create a comment', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/comments',
        payload: {
          url: 'URL',
          reference: 'UUID',
          content: 'MESSAGE',
          author: 'AUTHOR'
        }
      })

      expect(response.statusCode).to.equal(200)
      const result = JSON.parse(response.payload)

      expect(result).to.include({
        url: 'URL',
        reference: 'UUID',
        content: 'MESSAGE',
        author: 'AUTHOR',
        createdAt: result.createdAt
      })
    })
  })

  describe('GET /comments/{id}', () => {
    test('it should retrieve a comment', async () => {
      const created = await server.commentsService.add({
        url: 'URL',
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

      expect(result.createdAt).to.exists()

      delete result.createdAt
      delete created.createdAt
      expect(result).to.equal(created)
    })
  })

  describe('PUT /comments/{id}', () => {
    test('it should update a comment', async () => {
      const created = await server.commentsService.add({
        url: 'URL',
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

      expect(result.createdAt).to.exists()
      delete result.createdAt

      expect(result).to.equal({
        id: created.id,
        url: 'URL',
        reference: 'OLD-UUID',
        content: 'MESSAGE',
        author: 'OLD-AUTHOR'
      })
    })
  })

  describe('DELETE /comments/{id}', () => {
    test('it should delete a comment', async () => {
      const created = await server.commentsService.add({
        url: 'URL',
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
