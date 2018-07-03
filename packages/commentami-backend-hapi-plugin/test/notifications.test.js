'use strict'

const Nes = require('nes')
const { expect } = require('code')
const { random } = require('faker')
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const Lab = require('lab')
module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const { resetDb } = require('../../commentami-backend-core/test/utils')
const buildServer = require('./test-server')

describe('Comments Notification', () => {
  let server = null
  let client = null

  before(async () => {
    await resetDb()
    server = await buildServer({
      host: '127.0.0.1',
      port: 8281,
      pluginOptions: { multines: {}, notifications: { enabled: true, endPoint: '/notifications' } }
    })
    await server.start()

    this.resource = 'resource-id'
    this.reference = random.uuid()

    await new Promise(resolve => setTimeout(resolve, 100))
  })

  after(async () => {
    return server.stop()
  })

  describe('Websocket - adding a new comment', () => {
    test('it should be pushed to the users mentioned subscribers', async flags => {
      client = new Nes.Client('ws://127.0.0.1:8281')
      await client.connect()
      const axiosMock = new MockAdapter(axios)
      axiosMock.reset()
      let done
      let error

      const expectedData = [
        {
          notify: {
            action: 'mention',
            comment: {
              resource: 'resource-id',
              content: 'MESSAGE @davide @filippo'
            }
          },
          userIdentifier: 'davide'
        },
        {
          notify: {
            action: 'mention',
            comment: {
              content: 'MESSAGE @davide @filippo'
            }
          },
          userIdentifier: 'filippo'
        }
      ]

      let call = 0
      axiosMock.onPost('/notifications').reply(function(config) {
        try {
          const data = JSON.parse(config.data)
          expect(data.notify.action).to.be.equal(expectedData[call].notify.action)
          expect(data.notify.comment.content).to.be.equal(expectedData[call].notify.comment.content)
          expect(data.userIdentifier).to.be.equal(expectedData[call].userIdentifier)

          call++
        } catch (e) {
          error(e)
        }
        if (call === 2) {
          done()
        }
        return [200, {}]
      })

      await new Promise(async (resolve, reject) => {
        done = resolve
        error = reject

        const newComment1 = {
          resource: this.resource,
          reference: 'not my reference',
          content: 'MESSAGE @davide @filippo',
          author: 'paolo'
        }

        return server.inject({
          method: 'POST',
          url: '/comments',
          payload: newComment1
        })
      })
    })

    test('it should be pushed to the users response subscribers', async flags => {
      client = new Nes.Client('ws://127.0.0.1:8281')
      await client.connect()
      const axiosMock = new MockAdapter(axios)
      axiosMock.reset()

      let done
      let error

      const expectedData = [
        {
          notify: {
            action: 'involve',
            comment: {
              id: 2,
              content: 'Message 1'
            }
          },
          userIdentifier: 'paolo'
        },
        {
          notify: {
            action: 'involve',
            comment: {
              content: 'Message 2'
            }
          },
          userIdentifier: 'filippo'
        }
      ]

      let call = 0
      axiosMock.onPost('/notifications').reply(function(config) {
        try {
          const data = JSON.parse(config.data)
          expect(data.notify.action).to.be.equal(expectedData[call].notify.action)
          expect(data.notify.comment.content).to.be.equal(expectedData[call].notify.comment.content)
          expect(data.userIdentifier).to.be.equal(expectedData[call].userIdentifier)

          call++
        } catch (e) {
          error(e)
        }
        if (call === 2) {
          done()
        }
        return [200, {}]
      })

      await new Promise(async (resolve, reject) => {
        done = resolve
        error = reject

        await server.commentsService.add({
          resource: this.resource,
          reference: 'not my reference',
          content: 'Message 1',
          author: 'filippo'
        })
        await server.commentsService.add({
          resource: this.resource,
          reference: 'not my reference',
          content: 'Message 2',
          author: 'paolo'
        })

        await new Promise(resolve => setTimeout(resolve, 1000))

        const newComment1 = {
          resource: this.resource,
          reference: 'not my reference',
          content: 'MESSAGE @davide @filippo @AUTHOR',
          author: 'AUTHOR'
        }

        return server.inject({
          method: 'POST',
          url: '/comments',
          payload: newComment1
        })
      })
    })
  })
})
