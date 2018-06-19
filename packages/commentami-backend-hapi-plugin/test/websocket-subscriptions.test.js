'use strict'

const Nes = require('nes')
const { expect, fail } = require('code')
const { random, lorem, name, internet } = require('faker')

const Lab = require('lab')
module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const { resetDb } = require('../../commentami-backend-core/test/utils')
const buildServer = require('./test-server')

describe('Comments Websocket - routes', () => {
  let server = null
  let client = null

  before(async () => {
    await resetDb()
    server = await buildServer({
      host: '127.0.0.1',
      port: 8281,
      pluginOptions: { multines: {}, resolvers: { resolveUrl: () => 'http://localhost/' } }
    })
    await server.start()

    this.resource = internet.url()
    this.reference = random.uuid()

    const comments = new Array(20).fill(0).map((v, i) => ({
      resource: this.resource,
      reference: i === 0 ? this.reference : random.uuid(),
      content: lorem.words(),
      author: name.firstName()
    }))

    await Promise.all(comments.map(comment => server.commentsService.add(comment)))
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  after(async () => {
    return server.stop()
  })

  describe('Websocket - adding a new comment', () => {
    test('it should be pushed to resource subscribers', async flags => {
      client = new Nes.Client('ws://127.0.0.1:8281')
      await client.connect()

      await new Promise((resolve, reject) => {
        const newComment = {
          resource: this.resource,
          reference: 'UUID',
          content: 'MESSAGE',
          author: 'AUTHOR'
        }

        function handler(event, flags) {
          expect(event.comment).to.include(newComment)
          expect(event.action).to.equal('add')

          client.disconnect().then(resolve)
        }

        return client.subscribe(`/resources/${this.resource}`, handler).then(() => {
          return server.inject({
            method: 'POST',
            url: '/comments',
            payload: newComment
          })
        })
      })
    })
  })

  describe('Websocket - adding a new comment', () => {
    test('it should be pushed to resource and reference subscribers', async flags => {
      client = new Nes.Client('ws://127.0.0.1:8281')
      await client.connect()

      await new Promise((resolve, reject) => {
        const newComment1 = {
          resource: this.resource,
          reference: 'not my reference',
          content: 'MESSAGE',
          author: 'AUTHOR'
        }
        const newComment2 = {
          resource: this.resource,
          reference: this.reference,
          content: 'MESSAGE',
          author: 'AUTHOR'
        }

        function handler(event, flags) {
          expect(event.comment).to.include(newComment2)
          expect(event.action).to.equal('add')

          client.disconnect().then(resolve)
        }

        return client.subscribe(`/resources-reference/${this.reference}/${this.resource}`, handler).then(() => {
          return server
            .inject({
              method: 'POST',
              url: '/comments',
              payload: newComment1
            })
            .then(() => {
              return server.inject({
                method: 'POST',
                url: '/comments',
                payload: newComment2
              })
            })
        })
      })
    })

    test('it should be pushed to the users mentioned subscribers', async flags => {
      client = new Nes.Client('ws://127.0.0.1:8281')
      await client.connect()

      await new Promise(async (resolve, reject) => {
        const newComment1 = {
          resource: this.resource,
          reference: 'not my reference',
          content: 'MESSAGE @davide @filippo',
          author: 'AUTHOR'
        }

        let count = 1

        function handler(event, flags) {
          expect(event.comment).to.include(newComment1)
          expect(event.action).to.equal('mentioned')
          expect(event.url).to.equal(
            `http://localhost/?resource=${encodeURIComponent(event.comment.resource)}` +
              `&reference=${encodeURIComponent(event.comment.reference)}&comment=${event.comment.id}`
          )

          if (count-- === 0) {
            client.disconnect().then(resolve)
          }
        }

        await client.subscribe(`/users/davide`, handler)
        await client.subscribe(`/users/filippo`, handler)
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

      await new Promise(async (resolve, reject) => {
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

        let count = 2

        function handlerMention(event, flags) {
          expect(event.comment).to.include(newComment1)
          expect(event.action).to.equal('mentioned')
          expect(event.url).to.equal(
            `http://localhost/?resource=${encodeURIComponent(event.comment.resource)}` +
              `&reference=${encodeURIComponent(event.comment.reference)}&comment=${event.comment.id}`
          )
          if (count-- === 0) {
            client.disconnect().then(resolve)
          }
        }

        function handlerResponse(event, flags) {
          expect(event.comment).to.include(newComment1)
          expect(event.action).to.equal('involved')
          expect(event.url).to.equal(
            `http://localhost/?resource=${encodeURIComponent(event.comment.resource)}` +
              `&reference=${encodeURIComponent(event.comment.reference)}&comment=${event.comment.id}`
          )
          if (count-- === 0) {
            client.disconnect().then(resolve)
          }
        }

        function handlerResponseError(event, flags) {
          fail('The user that added the comment should not be notified')
        }

        await client.subscribe(`/users/davide`, handlerMention)
        await client.subscribe(`/users/filippo`, handlerMention)
        await client.subscribe(`/users/paolo`, handlerResponse)
        await client.subscribe(`/users/AUTHOR`, handlerResponseError)
        return server.inject({
          method: 'POST',
          url: '/comments',
          payload: newComment1
        })
      })
    })
  })

  describe('Websocket - update a comment', () => {
    test('it should be pushed to resource and reference subscribers', async flags => {
      client = new Nes.Client('ws://127.0.0.1:8281')
      await client.connect()

      await new Promise((resolve, reject) => {
        const newComment = {
          resource: this.resource,
          reference: this.reference,
          content: 'MESSAGE',
          author: 'AUTHOR'
        }
        const updateComment = {
          content: 'MESSAGE-updated'
        }

        function handler(event, flags) {
          if (event.action === 'add') return

          expect(event.comment).to.include(updateComment)
          expect(event.action).to.equal('update')

          client.disconnect().then(resolve)
        }

        return client.subscribe(`/resources-reference/${this.reference}/${this.resource}`, handler).then(() => {
          return server
            .inject({
              method: 'POST',
              url: '/comments',
              payload: newComment
            })
            .then(({ payload }) => {
              let comment = JSON.parse(payload)
              return server.inject({
                method: 'PUT',
                url: `/comments/${comment.id}`,
                payload: updateComment
              })
            })
        })
      })
    })
  })

  describe('Websocket - delete a comment', () => {
    test('the comment should be pushed to resource and reference subscribers', async flags => {
      client = new Nes.Client('ws://127.0.0.1:8281')
      await client.connect()

      await new Promise((resolve, reject) => {
        const newComment = {
          resource: this.resource,
          reference: this.reference,
          content: 'MESSAGE',
          author: 'AUTHOR'
        }

        function handler(event, flags) {
          if (event.action === 'add') return

          expect(event.comment).to.include(newComment)
          expect(event.action).to.equal('delete')

          client.disconnect().then(resolve)
        }

        return client.subscribe(`/resources-reference/${this.reference}/${this.resource}`, handler).then(() => {
          return server
            .inject({
              method: 'POST',
              url: '/comments',
              payload: newComment
            })
            .then(({ payload }) => {
              let comment = JSON.parse(payload)
              return server.inject({
                method: 'DELETE',
                url: `/comments/${comment.id}`
              })
            })
        })
      })
    })
  })
})
