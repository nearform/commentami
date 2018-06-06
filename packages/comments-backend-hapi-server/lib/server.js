'use strict'

module.exports = async function buildServer(config = {}, logMessage) {
  try {
    const server = require('hapi').Server(config.server)
    await server.register([
      {
        plugin: require('hapi-pino'),
        options: { prettyPrint: process.env.NODE_ENV !== 'production', logEvents: ['error'] }
      },
      {
        plugin: require('@nearform/comments-backend-hapi-plugin'),
        options: config.pluginOptions
      }
    ])

    server.commentsService.on('add', (comment) => logMessage('comment added', comment))
    server.commentsService.on('delete', (comment) => logMessage('comment deleted', comment))
    server.commentsService.on('update', (comment) => logMessage('comment updated', comment))

    return server
  } catch (err) {
    logMessage(`Failed to build server: ${err.message}`)
    process.exit(1)
  }
}
