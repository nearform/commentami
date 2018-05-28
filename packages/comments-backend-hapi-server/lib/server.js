'use strict'

module.exports = async function buildServer(config) {
  // If forked as child, send output message via ipc to parent, otherwise output to console
  const logMessage = process.send ? process.send : console.log // eslint-disable-line no-console

  try {
    const server = require('hapi').Server(config)

    await server.register([
      {
        plugin: require('hapi-pino'),
        options: { prettyPrint: process.env.NODE_ENV !== 'production', logEvents: ['error'] }
      },
      require('@nearform/comments-backend-hapi-plugin')
    ])

    return server
  } catch (err) {
    logMessage(`Failed to build server: ${err.message}`)
    process.exit(1)
  }
}
