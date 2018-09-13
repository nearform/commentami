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
    server = await buildServer({ host: '127.0.0.1', port: 0 })
    await server.start()
    port = server.info.port
  })

  after(() => {
    server.stop()
  })

  /* eslint-disable max-len */
  describe('Websocket - if the plugin option disableWebsocket is true, we should not be able to connect through websockets', () => {
    test('it should list all resource references', async () => {
      try {
        const client = new Nes.Client(`ws://127.0.0.1:${port}`)
        await promisify(client.connect.bind(client))({})

        throw new Error('Websocket is still reachable :/')
      } catch (e) {
        expect(e.message).to.equal('Socket error')
      }
    })
  })
})
