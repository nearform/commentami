'use strict'

const { expect } = require('code')
const Lab = require('lab')
const sinon = require('sinon')

module.exports.lab = Lab.script()
const { describe, it: test, before, beforeEach, after } = module.exports.lab

const { resetDb } = require('../../commentami-backend-core/test/utils')
const config = require('../config')
const buildServer = require('../lib/server')

const authHeader = `Basic ${Buffer.from('test:test').toString('base64')}`

describe('Server', () => {
  let server = null
  let logMessage = sinon.spy()

  before(async () => {
    server = await buildServer(config, logMessage)
  })

  beforeEach(async () => {
    await resetDb()
  })

  after(async () => {
    server.stop()
  })

  describe('HTTP REST API', () => {
    describe('GET /comments/{id}', () => {
      test('it should retrieve a comment', async () => {
        const created = await server.commentsService.add({
          resource: 'URL',
          reference: 'OLD-UUID',
          content: 'OLD-MESSAGE',
          author: 'test'
        })

        const response = await server.inject({
          method: 'GET',
          url: `/comments/${created.id}`,
          headers: {
            authorization: authHeader
          }
        })

        expect(response.statusCode).to.equal(200)
        const result = JSON.parse(response.payload)

        expect(result.createdAt).to.exists()
        delete result.createdAt
        delete created.createdAt

        expect(result.resource).to.equal(created.resource)
        expect(result.reference).to.equal(created.reference)
        expect(result.content).to.equal(created.content)
        expect(result.author).to.be.object()
        expect(result.author).to.equal({
          id: 4,
          username: 'test',
          firstName: 'test',
          lastName: 'test',
          avatarUrl: 'https://api.adorable.io/avatars/285/test@commentami.com.png',
          profileUrl: 'https://www.google.com'
        })
      })

      test('it should log operations', async () => {
        logMessage.resetHistory()

        const created = await server.commentsService.add({
          resource: 'URL',
          reference: 'OLD-UUID',
          content: 'OLD-MESSAGE',
          author: 'test'
        })

        await server.commentsService.update(created.id, {
          resource: 'URL',
          reference: 'OLD-UUID',
          content: 'OLD-MESSAGE',
          author: 'test'
        })

        await server.commentsService.delete(created.id)

        expect(logMessage.callCount).to.equal(3)
      })
    })

    describe('GET /comments?resource={resource}', () => {
      test('it should retrieve a list of comments', async () => {
        await server.commentsService.add({
          resource: 'URL',
          reference: 'OLD-UUID',
          content: 'OLD-MESSAGE',
          author: 'test'
        })

        await server.commentsService.add({
          resource: 'URL',
          reference: 'OLD-UUID2',
          content: 'OLD-MESSAGE2',
          author: 'test'
        })

        const response = await server.inject({
          method: 'GET',
          url: `/comments?resource=URL`,
          headers: {
            authorization: authHeader
          }
        })

        expect(response.statusCode).to.equal(200)
        const result = JSON.parse(response.payload)

        expect(result).to.be.object()
        expect(result).to.include({
          total: 2,
          limit: 100,
          offset: 0
        })
        expect(result.comments).to.exists()
        expect(result.comments.length).to.be.at.least(1)
        expect(result.comments[0].author).to.exists()
        expect(result.comments[0].author).to.include({
          username: 'test',
          firstName: 'test',
          lastName: 'test',
          avatarUrl: 'https://api.adorable.io/avatars/285/test@commentami.com.png',
          profileUrl: 'https://www.google.com'
        })
      })
    })
  })
})
