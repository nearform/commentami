'use strict'

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
  let client1 = null
  let client2 = null

  before(async () => {
    await resetDb()
    server1 = await buildServer({ host: '127.0.0.1', port: 8281, pluginOptions: { multines: multinesConfig } })
    server2 = await buildServer({ host: '127.0.0.1', port: 8282, pluginOptions: { multines: multinesConfig } })
    await server1.start()
    await server2.start()
  })

  after(async () => {
    await server1.stop()
    await server2.stop()
  })

  describe('Websocket (2 servers) - adding a new comment', () => {
    test('it should be pushed to resource subscribers', async flags => {
      const resource = 'http://example.com'

      client1 = new Nes.Client('ws://127.0.0.1:8281')
      await client1.connect()

      client2 = new Nes.Client('ws://127.0.0.1:8282')
      await client2.connect()

      await new Promise((resolve, reject) => {
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

        function handler(event, flags) {
          expect(event.comment).to.include(expected)
          expect(event.action).to.equal('add')

          client1
            .disconnect()
            .then(() => client2.disconnect())
            .then(resolve)
        }

        return client1.subscribe(`/resources/${resource}`, handler).then(() => {
          return client2.request({
            method: 'POST',
            path: '/comments',
            payload: newComment
          })
        })
      })
    })
  })
})
