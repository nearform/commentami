'use strict'

const config = require('../config')

module.exports = async function server() {
  // If forked as child, send output message via ipc to parent, otherwise output to console
  const logMessage = process.send ? process.send : console.log

  const server = require('hapi').Server(config)

  try {
    await server.register([
      {
        plugin: require('hapi-pino'),
        options: { prettyPrint: process.env.NODE_ENV !== 'production', logEvents: ['error'] }
      },
      require('@nearform/comments-backend-hapi-plugin')
    ])

    await server.start()
    logMessage(`Server running at: ${server.info.uri}`)

    return server
  } catch (err) {
    logMessage(`Failed to start server: ${err.message}`)
    process.exit(1)
  }
}
