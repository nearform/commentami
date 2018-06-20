'use strict'

const Nes = require('nes')
const { expect } = require('code')
const Lab = require('lab')

module.exports.lab = Lab.script()
const { describe, it: test, before, beforeEach, after } = module.exports.lab

const { resetDb } = require('../../commentami-backend-core/test/utils')
const config = require('../config')
const buildServer = require('../lib/server')

const authHeader = `Basic ${Buffer.from('test:test').toString('base64')}`

describe('Server', () => {
  let server = null
  let logMessage = console.log // eslint-disable-line no-console

  before(async () => {
    server = await buildServer(config, logMessage)

    await server.start()
  })

  beforeEach(async () => {
    await resetDb()
  })

  after(async () => {
    server.stop()
  })

  describe('generic', () => {
    describe('GET /comments/{id}', () => {
      test('it should retrieve a comment', async () => {
        const client = new Nes.Client('ws://127.0.0.1:8080')
        await client.connect({ auth: { headers: { authorization: authHeader } } })

        const response = await client.request({
          method: 'POST',
          path: '/comments',
          payload: {
            resource: 'URL',
            reference: 'UUID',
            content: 'MESSAGE'
          }
        })

        expect(response.payload.createdAt).to.exists()
        delete response.payload.createdAt

        expect(response.payload.resource).to.equal('URL')
        expect(response.payload.reference).to.equal('UUID')
        expect(response.payload.content).to.equal('MESSAGE')
        expect(response.payload.author).to.be.object()
        expect(response.payload.author).to.include({
          username: 'test',
          firstName: 'test',
          lastName: 'test',
          avatarUrl: 'https://api.adorable.io/avatars/285/test@commentami.com.png',
          profileUrl: 'https://www.google.com'
        })

        await client.disconnect()
      })
    })

    describe('Connect to server', () => {
      test('connecting requires authentication', async () => {
        const client = new Nes.Client('ws://127.0.0.1:8080')
        try {
          await client.connect()
          expect('I should not reach this line').to.exists('')
        } catch (e) {
          expect(e.message).to.equal('Connection requires authentication')
        }

        await client.disconnect()
      })
    })
  })
})
