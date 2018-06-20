'use strict'

const Boom = require('boom')

module.exports = async function buildServer(config = {}) {
  // If forked as child, send output message via ipc to parent, otherwise output to console
  const logMessage = process.send ? process.send : console.log // eslint-disable-line no-console

  try {
    const server = require('hapi').Server({
      host: config.host || '127.0.0.1',
      port: config.port || 8080
    })

    if (config.auth === true) {
      await server.register(fakeAuthPlugin)
      server.auth.strategy(fakeAuthPlugin.name, 'myauth', { validate: fakeAuthPlugin.validate })
    }

    if (!config.pluginOptions) {
      config.pluginOptions = {}
    }

    if (!config.pluginOptions.resolvers) {
      config.pluginOptions.resolvers = {
        resolveUrl: () => 'http://localhost/'
      }
    }

    await server.register({ plugin: require('../lib/index'), options: config.pluginOptions })

    return server
  } catch (err) {
    logMessage(`Failed to build server: ${err.message}`)
    process.exit(1)
  }
}

const fakeAuthPlugin = {
  name: 'myauth',
  register: (server, options) => {
    server.auth.scheme('myauth', (server, options) => {
      const scheme = {
        authenticate: async function(request, h) {
          const authorization = request.headers.authorization

          if (!authorization) {
            throw Boom.unauthorized(null, 'myauth')
          }

          const { isValid, credentials } = await options.validate(request, authorization, h)

          if (!isValid) {
            return h.unauthenticated(Boom.unauthorized('Bad user!'), credentials ? { credentials } : null)
          }

          return h.authenticated({ credentials })
        }
      }

      return scheme
    })
  },
  validate: async (request, authorization, h) => {
    if (authorization) {
      return { isValid: true, credentials: { id: 'test' } }
    }

    return { isValid: false }
  }
}
