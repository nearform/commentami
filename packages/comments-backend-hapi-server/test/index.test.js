'use strict'

const { expect } = require('code')
const Lab = require('lab')
const sinon = require('sinon')

module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const testServer = require('./test-server')

describe('Server', () => {
  let server = null
  const stubs = []

  before(async () => {
    stubs.push(
      sinon.stub(process, 'exit').callsFake(code => {
        throw new Error(`EXITED - ${code}`)
      })
    )
    stubs.push(sinon.stub(global.console, 'log'))
    stubs.push(sinon.stub(global.console, 'error'))

    server = await testServer.buildDefault()
  })

  after(async () => {
    await testServer.stopAll()
    stubs.map(c => c.restore())
  })

  describe('generic', () => {
    test('should log in case of listen errors', async () => {
      process.send = console.log // eslint-disable-line no-console
      await expect(testServer.build()).to.reject(Error, 'EXITED - 1')
      expect(stubs[1].called).to.be.true()
    })

    describe('GET /comments/{id}', () => {
      test('it should retrieve a comment', async () => {
        const created = await server.commentsService.add({
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

        expect(result).to.equal(created)
      })
    })
  })
})
