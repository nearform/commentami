'use strict'

const config = require('../config')
const buildServer = require('./server')

module.exports = async function start() {
  // If forked as child, send output message via ipc to parent, otherwise output to console
  const logMessage = process.send ? process.send : console.log // eslint-disable-line no-console

  try {
    const server = await buildServer(config)
    await server.start()
    logMessage(`Server running at: ${server.info.uri}`)

    return server
  } catch (err) {
    logMessage(`Failed to start server: ${err.message}`)
    process.exit(1)
  }
}
