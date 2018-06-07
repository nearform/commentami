'use strict'

const { expect } = require('code')
const Lab = require('lab')
const sinon = require('sinon')

module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const { resetDb } = require('../../comments-backend-core/test/utils')
const config = require('../config')
const buildServer = require('../lib/server')

describe('Server', () => {
  let server = null
  let logMessage = sinon.spy()

  before(async () => {
    await resetDb()
    server = await buildServer(config, logMessage)
  })

  after(async () => {
    server.stop()
  })

  describe('generic', () => {
    describe('GET /comments/{id}', () => {
      test('it should retrieve a comment', async () => {
        const created = await server.commentsService.add({
          resource: 'URL',
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

      test('it should log operations', async () => {
        logMessage.resetHistory()

        const created = await server.commentsService.add({
          resource: 'URL',
          reference: 'OLD-UUID',
          content: 'OLD-MESSAGE',
          author: 'OLD-AUTHOR'
        })

        await server.commentsService.update(created.id, {
          resource: 'URL',
          reference: 'OLD-UUID',
          content: 'OLD-MESSAGE',
          author: 'OLD-AUTHOR'
        })

        await server.commentsService.delete(created.id)

        expect(logMessage.callCount).to.equal(3)
      })
    })
  })
})
