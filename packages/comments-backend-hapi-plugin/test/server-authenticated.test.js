'use strict'

const { expect } = require('code')
const Lab = require('lab')
const { random, lorem, name, internet } = require('faker')

module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const { resetDb } = require('../../comments-backend-core/test/utils')
const buildServer = require('./test-server')

describe('Comments REST API', () => {
  let server = null

  before(async () => {
    await resetDb()
    server = await buildServer({
      auth: true,
      pluginOptions : {
        routes: {
          auth: 'myauth',
          getUser: async (request, payload) => {
            const user = request.auth.credentials

            return user
          }
        }
      }
    })
  })

  after(async () => {
    return server.stop()
  })

  describe('GET /comments-references/{resource}', () => {
    test('it should return 401 when not providing an authorization header', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/comments-references/abc`
      })

      expect(response.statusCode).to.equal(401)
    })

    test('it should return the list of references when providing an authorization header', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/comments-references/abc`,
        headers: {
          'authorization': 'somthing that will make the test pass'
        }
      })

      expect(response.statusCode).to.equal(200)
      const result = JSON.parse(response.payload)
      expect(result).to.equal({ resource: 'abc', references: [] })
    })
  })

  describe('POST /comments', () => {
    test('it should create a comment', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/comments',
        payload: {
          resource: 'URL',
          reference: 'UUID',
          content: 'MESSAGE'
        },
        headers: {
          'authorization': 'somthing that will make the test pass'
        }
      })

      expect(response.statusCode).to.equal(200)
      const result = JSON.parse(response.payload)

      expect(result).to.include({
        resource: 'URL',
        reference: 'UUID',
        content: 'MESSAGE',
        author: '1',
        createdAt: result.createdAt
      })
    })
  })
})
