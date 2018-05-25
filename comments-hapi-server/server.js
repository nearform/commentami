'use strict'

const Hapi = require('hapi')
const config = require('./config')

const server = Hapi.server(config)

const setupServer = async () => {
  await server.register([
    {
      plugin: require('hapi-pino'),
      options: {
        prettyPrint: process.env.NODE_ENV !== 'production',
        logEvents: ['error']
      }
    },
    require('../comments-hapi-plugin')
  ])

  return server
}

const start = async () => {
  await setupServer()
  await server.start()

  console.log('server running', config) // eslint-disable-line no-console
}

module.exports = {
  setupServer,
  start
}
