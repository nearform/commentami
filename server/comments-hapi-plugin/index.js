'use strict'

const { buildCommentsService, initPool, config } = require('../comments-core')
const routes = require('./routes')

const commentsHapiPlugin = {
  name: 'comments-hapi-plugin',
  version: '1.0.0',
  register: async function (server, options) {
    const db = initPool(config.pg)
    const commentsService = buildCommentsService(db)

    server.decorate('server', 'commentsService', commentsService)
    server.decorate('request', 'commentsService', commentsService)
    server.route(routes)

    server.ext('onPostStop', async () => {
      await commentsService.close()
    })
  }
}

module.exports = commentsHapiPlugin