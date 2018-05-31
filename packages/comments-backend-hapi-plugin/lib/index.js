'use strict'

const Nes = require('nes')
const Multines = require('multines')
const { buildCommentsService, buildPool, config } = require('@nearform/comments-backend-core')
const { notifyComment } = require('./subscriptions')

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
      let { redis } = options
      if (!redis) {
        redis = {}
      }

      await server.register([Nes, {
        plugin: {
          name: 'multines',
          register: Multines.register
        },
        options: { type: 'redis', ...redis }
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
