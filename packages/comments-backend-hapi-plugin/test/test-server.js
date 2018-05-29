'use strict'

module.exports = async function buildServer(config = {}) {
  // If forked as child, send output message via ipc to parent, otherwise output to console
  const logMessage = process.send ? process.send : console.log // eslint-disable-line no-console

  try {
    const server = require('hapi').Server({
      host: config.host || '127.0.0.1',
      port: config.port || 8080
    })
    await server.register({ plugin: require('../lib/index'), options: config.pluginOptions })

    return server
  } catch (err) {
    logMessage(`Failed to build server: ${err.message}`)
    process.exit(1)
  }
}
