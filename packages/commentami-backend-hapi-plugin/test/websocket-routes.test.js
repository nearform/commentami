'use strict'

const Nes = require('nes')
const { expect } = require('code')
const Lab = require('lab')
const { random, lorem, name, internet } = require('faker')

module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const { resetDb } = require('../../commentami-backend-core/test/utils')
const buildServer = require('./test-server')

describe('Comments Websocket - routes', () => {
  let server = null
  let client = null

  before(async () => {
    await resetDb()
    server = await buildServer({ host: '127.0.0.1', port: 8281, pluginOptions: { multines: {} } })
    await server.start()

    client = new Nes.Client('ws://127.0.0.1:8281')
    await client.connect()

    this.resource = internet.url()
    this.reference = random.uuid()

    const comments = new Array(20).fill(0).map((v, i) => ({
      resource: this.resource,
      reference: i === 0 ? this.reference : random.uuid(),
      content: lorem.words(),
      author: name.firstName()
    }))

    return Promise.all(comments.map(comment => server.commentsService.add(comment)))
  })

  after(async () => {
    return server.stop()
  })

  describe('Websocket - GET /comments-references/{resource}', () => {
    test('it should list all resource refereces', async () => {
      const response = await client.request(`/comments-references/${this.resource}`)
      const payload = response.payload

      expect(payload.resource).to.equal(this.resource)
      expect(payload.references).to.be.array()
      expect(payload.references.length).to.equal(20)
      expect(payload.references).to.include(this.reference)
    })
  })

  describe('Websocket - Websocket - GET /comments', () => {
    test('it should search comments by url and return them with 200', async () => {
      const all = await server.commentsService.list(this.resource)
      const response = await client.request(`/comments?resource=${this.resource}&limit=3&offset=5`)
      const payload = response.payload

      expect(payload).to.include({
        total: 20,
        limit: 3,
        offset: 5
      })

      expect(payload.comments.length).to.equal(3)
      expect(payload.comments[0].id).to.equal(all.comments[5].id)
    })

    test('it should search comments by url and reference and return them with 200', async () => {
      const response = await client.request(`/comments?resource=${this.resource}&reference=${this.reference}&limit=3`)
      const payload = response.payload

      expect(payload).to.include({
        total: 1,
        limit: 3,
        offset: 0
      })

      expect(payload.comments.length).to.equal(1)
    })
  })

  describe('POST /comments', () => {
    test('it should create a comment', async () => {
      const response = await client.request({
        method: 'POST',
        path: `/comments`,
        payload: {
          resource: 'URL',
          reference: 'UUID',
          content: 'MESSAGE',
          author: 'AUTHOR'
        }
      })
      const payload = response.payload

      expect(payload).to.include({
        resource: 'URL',
        reference: 'UUID',
        content: 'MESSAGE',
        author: { username: 'AUTHOR' },
        createdAt: payload.createdAt
      })
    })
  })

  describe('GET /comments/{id}', () => {
    test('it should retrieve a comment', async () => {
      const created = await server.commentsService.add({
        resource: 'URL',
        reference: 'OLD-UUID',
        content: 'OLD-MESSAGE',
        author: 'OLD-AUTHOR'
      })

      const response = await client.request(`/comments/${created.id}`)
      const payload = response.payload

      expect(payload.createdAt).to.exists()

      delete payload.createdAt
      delete created.createdAt
      expect(payload).to.equal(created)
    })
  })

  describe('PUT /comments/{id}', () => {
    test('it should update a comment', async () => {
      const created = await server.commentsService.add({
        resource: 'URL',
        reference: 'OLD-UUID',
        content: 'OLD-MESSAGE',
        author: 'OLD-AUTHOR'
      })

      const response = await client.request({
        method: 'PUT',
        path: `/comments/${created.id}`,
        payload: {
          content: 'MESSAGE'
        }
      })
      const payload = response.payload

      expect(payload.createdAt).to.exists()
      delete payload.createdAt

      expect(payload).to.equal({
        id: created.id,
        resource: 'URL',
        reference: 'OLD-UUID',
        content: 'MESSAGE',
        author: { username: 'OLD-AUTHOR' },
        mentions: []
      })
    })
  })

  describe('DELETE /comments/{id}', () => {
    test('it should delete a comment', async () => {
      const created = await server.commentsService.add({
        resource: 'URL',
        reference: 'OLD-UUID',
        content: 'OLD-MESSAGE',
        author: 'OLD-AUTHOR'
      })

      const response = await client.request({
        method: 'DELETE',
        path: `/comments/${created.id}`
      })
      const payload = response.payload

      expect(payload).to.equal({ success: true })
    })
  })
})
