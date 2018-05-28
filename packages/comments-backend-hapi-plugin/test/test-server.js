'use strict'

module.exports = async function buildServer() {
  // If forked as child, send output message via ipc to parent, otherwise output to console
  const logMessage = process.send ? process.send : console.log // eslint-disable-line no-console

  try {
    const server = require('hapi').Server({
      host: '127.0.0.1',
      port: 8080
    })
    await server.register({ plugin: require('../lib/index') })

    return server
  } catch (err) {
    logMessage(`Failed to build server: ${err.message}`)
    process.exit(1)
  }
}
