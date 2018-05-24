'use strict'

const Hapi = require('hapi')
const server = Hapi.server({
    port: 8080,
    host: 'localhost'
});

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
};

const start = async () => {
  await setupServer()
  await server.start()
};

module.exports = {
  setupServer,
  start
}
