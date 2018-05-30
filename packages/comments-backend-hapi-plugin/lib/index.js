'use strict'

const Nes = require('nes')
const { buildCommentsService, buildPool, config } = require('@nearform/comments-backend-core')
const { notifyComment } = require('./subscriptions')

const commentsHapiPlugin = {
  name: 'comments-hapi-plugin',
  version: '1.0.0',
  register: async function(server, options) {
    const db = buildPool(config.pg)
    const commentsService = buildCommentsService(db, options)

    server.decorate('server', 'commentsService', commentsService)
    server.decorate('request', 'commentsService', commentsService)

    if (options.disableWebsocket !== true) {
      await server.register(Nes)

      server.subscription('/resources/{resource*}')
      server.subscription('/resources-reference/{reference}/{resource*}')
      server.method('notifyComment', notifyComment.bind(server))
    }

    await server.register(require('./routes'))

    server.ext('onPostStop', async () => {
      await commentsService.close()
    })
  }
}

module.exports = commentsHapiPlugin
