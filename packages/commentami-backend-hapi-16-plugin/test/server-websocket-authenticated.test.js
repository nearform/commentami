'use strict'
const { promisify } = require('util')
const Nes = require('nes')
const { expect } = require('code')
const Lab = require('lab')

module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const { resetDb } = require('../../commentami-backend-core/test/utils')
const buildServer = require('./test-server')

describe('Comments REST API', () => {
  let server = null
  let port = null

  before(async () => {
    await resetDb()
    server = await buildServer({
      port: 0,
      host: '127.0.0.1',
      auth: true,
      pluginOptions: {
        nes: {
          auth: {
            route: 'myauth'
          }
        },
        multines: {},
        routes: {
          auth: 'myauth',
          getUserFromRequest: async (request, payload) => {
            let user = request.auth.credentials
            return user
          }
        }
      }
    })
    await server.start()
    port = server.info.port
  })

  after(() => {
    server.stop()
  })

  describe('GET /comments-references/{resource}', () => {
    test('it should return 401 when not providing an authorization header', async () => {
      const client = new Nes.Client(`ws://127.0.0.1:${port}`)

      try {
        await promisify(client.connect.bind(client))()

        throw new Error('We should get an error when requesting a protected resource')
      } catch (e) {
        expect(e.message).to.equal('Connection requires authentication')
      }

      await promisify(client.disconnect.bind(client))()
    })

    test('it should return the list of references when providing an authorization header', async () => {
      const client = new Nes.Client(`ws://127.0.0.1:${port}`)
      await promisify(client.connect.bind(client))({ auth: { headers: { authorization: 'Custom john' } } })

      const response = await promisify(client.request.bind(client))('/comments-references/abc')

      expect(response).to.equal({ resource: 'abc', references: [] })

      await promisify(client.disconnect.bind(client))()
    })
  })

  describe('POST /comments', () => {
    test('it should create a comment', async () => {
      const client = new Nes.Client(`ws://127.0.0.1:${port}`)
      await promisify(client.connect.bind(client))({ auth: { headers: { authorization: 'Custom john' } } })

      const response = await promisify(client.request.bind(client))({
        method: 'POST',
        path: '/comments',
        payload: {
          resource: 'URL',
          reference: 'UUID',
          content: 'MESSAGE'
        }
      })

      expect(response).to.include({
        resource: 'URL',
        reference: 'UUID',
        content: 'MESSAGE',
        author: { username: 'test' }
      })

      await promisify(client.disconnect.bind(client))()
    })
  })
})
