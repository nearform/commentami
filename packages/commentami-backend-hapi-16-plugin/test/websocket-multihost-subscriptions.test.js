'use strict'

const { promisify } = require('util')
const Nes = require('nes')
const { expect } = require('code')

const Lab = require('lab')
module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const { resetDb } = require('../../commentami-backend-core/test/utils')
const buildServer = require('./test-server')

const multinesConfig = {
  type: 'redis',
  host: 'localhost',
  port: 6379
}

describe('Comments Websocket - routes', () => {
  let server1 = null
  let server2 = null
  let port1 = null
  let port2 = null
  let client1 = null
  let client2 = null

  before(async () => {
    await resetDb()
    server1 = await buildServer({ host: '127.0.0.1', port: 0, pluginOptions: { multines: multinesConfig } })
    server2 = await buildServer({ host: '127.0.0.1', port: 0, pluginOptions: { multines: multinesConfig } })
    await server1.start()
    port1 = server1.info.port
    await server2.start()
    port2 = server2.info.port
  })

  after(() => {
    server1.stop()
    server2.stop()
  })

  describe('Websocket (2 servers) - adding a new comment', () => {
    test('it should be pushed to resource subscribers', async flags => {
      const resource = 'http://example.com'

      client1 = new Nes.Client(`ws://127.0.0.1:${port1}`)
      await promisify(client1.connect.bind(client1))({})

      client2 = new Nes.Client(`ws://127.0.0.1:${port2}`)
      await promisify(client2.connect.bind(client2))({})

      await new Promise(async (resolve, reject) => {
        const newComment = {
          resource: resource,
          reference: 'UUID',
          content: 'MESSAGE',
          author: 'AUTHOR'
        }

        const expected = {
          resource: resource,
          reference: 'UUID',
          content: 'MESSAGE',
          author: { username: 'AUTHOR' }
        }

        async function handler(event, flags) {
          expect(event.comment).to.include(expected)
          expect(event.action).to.equal('add')

          await promisify(client1.disconnect.bind(client1))()
          await promisify(client2.disconnect.bind(client2))()
          resolve()
        }

        await promisify(client1.subscribe.bind(client1))(`/resources/${resource}`, handler)
        await promisify(client2.request.bind(client2))({
          method: 'POST',
          path: '/comments',
          payload: newComment
        })
      })
    })
  })
})
