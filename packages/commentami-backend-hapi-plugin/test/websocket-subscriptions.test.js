'use strict'

const Nes = require('nes')
const { expect } = require('code')
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
    server = await buildServer({ host: '127.0.0.1', port: 8281, pluginOptions: { multines: {} } })
    await server.start()

    this.resource = internet.url()
    this.reference = random.uuid()

    const comments = new Array(20).fill(0).map((v, i) => ({
      resource: this.resource,
      reference: i === 0 ? this.reference : random.uuid(),
      content: lorem.words(),
      author: name.firstName()
    }))

    return Promise.all(comments.map(comment => server.commentsService.add(comment)))
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

      await new Promise((resolve, reject) => {
        const newComment1 = {
          resource: this.resource,
          reference: 'not my reference',
          content: 'MESSAGE @davide @filippo',
          author: 'AUTHOR'
        }

        let count = 1
        function handler(event, flags) {
          expect(event.comment).to.include(newComment1)
          expect(event.action).to.equal('add')

          if (count--) {
            client.disconnect().then(resolve)
          }
        }

        return Promise.all([
          client.subscribe(`/users/davide`, handler).then(() => {
            return server.inject({
              method: 'POST',
              url: '/comments',
              payload: newComment1
            })
          }),
          client.subscribe(`/users/filippo`, handler).then(() => {
            return server.inject({
              method: 'POST',
              url: '/comments',
              payload: newComment1
            })
          })
        ])
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
