'use strict'

const { assign } = require('lodash')
const Nes = require('nes')
const Multines = require('multines')
const { buildCommentsService, buildPool, config } = require('@nearform/comments-backend-core')
const { notifyComment } = require('./subscriptions')

const commentsHapiPlugin = {
  name: 'comments-hapi-plugin',
  version: '1.0.0',
  register: async function(server, options) {
    const db = buildPool(assign({}, config.pg, (options && options.pg) || {}))
    const commentsService = buildCommentsService(db, options)

    server.decorate('server', 'commentsService', commentsService)
    server.decorate('request', 'commentsService', commentsService)

    if (options.disableWebsocket !== true) {
      let multinesOptions = options.multines || {}

      await server.register([Nes, {
        plugin: {
          name: 'multines',
          register: Multines.register
        },
        options: multinesOptions
      }])

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
