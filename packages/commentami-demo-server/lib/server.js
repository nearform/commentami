'use strict'

const Basic = require('hapi-auth-basic')
const { validate } = require('./auth')
const commentsHooks = require('./comments-hooks')
const resolvers = require('./resolvers')

module.exports = async function buildServer(config = {}, logMessage) {
  try {
    const server = require('hapi').Server(config.server)

    await server.register([Basic])
    server.auth.strategy('simple', 'basic', { validate })

    await server.register([
      {
        plugin: require('hapi-pino'),
        options: { prettyPrint: process.env.NODE_ENV !== 'production', logEvents: ['error'] }
      },
      {
        plugin: require('@nearform/commentami-backend-hapi-plugin'),
        options: Object.assign({}, config.pluginOptions, {
          auth: true,
          nes: {
            auth: {
              route: 'simple'
            }
          },
          routes: {
            cors: true,
            auth: 'simple',
            getUser: async (request, payload) => {
              let user = request.auth.credentials

              return user
            }
          },
          hooks: commentsHooks,
          resolvers
        })
      }
    ])

    server.commentsService.on('add', comment => logMessage('comment added', comment))
    server.commentsService.on('delete', comment => logMessage('comment deleted', comment))
    server.commentsService.on('update', comment => logMessage('comment updated', comment))

    return server
  } catch (err) {
    logMessage(`Failed to build server: ${err.message}`, err)
    process.exit(1)
  }
}
