'use strict'

const redis = require('mqemitter-redis')
const Nes = require('nes')
const { buildCommentsService, buildPool, config } = require('@nearform/comments-backend-core')
const { notifyComment } = require('./subscriptions')

const kDeliver = Symbol.for('deliver')

function buildDeliver (socket, topic) {
  return async function deliver (message, done) {
    if (topic === message.topic) {
      await socket.publish(topic, message.body)
    } else {
      await socket.publish(topic, message)
    }
  }
}

const commentsHapiPlugin = {
  name: 'comments-hapi-plugin',
  version: '1.0.0',
  register: async function(server, options) {
    // rewrite so it takes the options instead of the config?
    const db = buildPool(config.pg)
    const commentsService = buildCommentsService(db, options)

    server.decorate('server', 'commentsService', commentsService)
    server.decorate('request', 'commentsService', commentsService)

    if (options.disableWebsocket !== true) {
      await server.register(Nes)

      const mq = redis(options.redis)

      server.decorate('server', 'subscriptionFar', (path, options) => {
        options = options || {}

        const wrapSubscribe = options.onSubscribe || (async (socket, path, params) => null)
        const wrapUnsubscribe = options.onUnsubscribe || (async (socket, path, params) => null)

        options.onSubscribe = async (socket, path, params) => {
          const deliverMap = socket[kDeliver] || {}
          socket[kDeliver] = deliverMap

          if (!deliverMap[path]) {
            deliverMap[path] = buildDeliver(socket, path)
          }

          await wrapSubscribe(socket, path, params)
          await new Promise((resolve, reject) => {
            mq.on(path, deliverMap[path], (err) => {
              if (err) return reject(err)
              resolve()
            })
          })
        }

        options.onUnsubscribe = async (socket, path, params) => {
          await wrapUnsubscribe(socket, path, params)

          const deliverMap = socket[kDeliver] || {}
          socket[kDeliver] = deliverMap

          if (!deliverMap[path]) {
            return
          }

          await new Promise((resolve, reject) => {
            mq.removeListener(path, deliverMap[path], (err) => {
              if (err) return reject(err)
              resolve()
            })
          })
        }

        server.subscription(path, options)
      })

      server.decorate('server', 'publishFar', async (path, body) => {
        options = options || {}

        await new Promise((resolve, reject) => {
          mq.emit({ topic: path, body }, (err) => {
            if (err) return reject(err)
            resolve()
          })
        })
      })

      server.ext('onPostStop', async () => {
        await new Promise((resolve, reject) => {
          mq.close((err) => {
            if (err) return reject(err)
            resolve()
          })
        })
      })

      server.subscriptionFar('/resources/{resource*}')
      server.subscriptionFar('/resources-reference/{reference}/{resource*}')
      server.method('notifyComment', notifyComment.bind(server))
    }

    await server.register(require('./routes'))

    server.ext('onPostStop', async () => {
      await commentsService.close()
    })
  }
}

module.exports = commentsHapiPlugin
