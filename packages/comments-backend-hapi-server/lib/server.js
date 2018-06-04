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

    return server
  } catch (err) {
    logMessage(`Failed to build server: ${err.message}`)
    process.exit(1)
  }
}
