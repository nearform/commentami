'use strict'

const Nes = require('nes')
const { expect } = require('code')
const Lab = require('lab')

module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const { resetDb } = require('../../commentami-backend-core/test/utils')
const buildServer = require('./test-server')

describe('Comments REST API', () => {
  let server = null

  before(async () => {
    await resetDb()
    server = await buildServer({ host: '127.0.0.1', port: 8281 })
    await server.start()
  })

  after(async () => {
    return server.stop()
  })

  /* eslint-disable max-len */
  describe('Websocket - if the plugin option disableWebsocket is true, we should not be able to connect through websockets', () => {
    test('it should list all resource refereces', async () => {
      try {
        const client = new Nes.Client('ws://127.0.0.1:8281')
        await client.connect()

        throw new Error('Websocket is still reachable :/')
      } catch (e) {
        expect(e.message).to.equal('Socket error')
      }
    })
  })
})
