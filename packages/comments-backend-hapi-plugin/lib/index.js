'use strict'

const { buildCommentsService, buildPool, config } = require('@nearform/comments-backend-core')

const commentsHapiPlugin = {
  name: 'comments-hapi-plugin',
  version: '1.0.0',
  register: async function(server, options) {
    const db = buildPool(config.pg)
    const commentsService = buildCommentsService(db, options)

    server.decorate('server', 'commentsService', commentsService)
    server.decorate('request', 'commentsService', commentsService)

    await server.register(require('./routes'))

    server.ext('onPostStop', async () => {
      await commentsService.close()
    })
  }
}

module.exports = commentsHapiPlugin
