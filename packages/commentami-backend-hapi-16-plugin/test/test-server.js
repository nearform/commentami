'use strict'

const Boom = require('boom')
const hapi = require('hapi')

module.exports = async function buildServer(config = {}) {
  // If forked as child, send output message via ipc to parent, otherwise output to console
  const logMessage = process.send ? process.send : console.log // eslint-disable-line no-console

  try {
    const server = new hapi.Server()
    server.connection({
      host: config.host || '127.0.0.1',
      port: 0
    })

    server.on('response', function(request) {
      global.console.log(
        request.info.remoteAddress +
          ': ' +
          request.method.toUpperCase() +
          ' ' +
          request.url.path +
          ' --> ' +
          request.response.statusCode
      )
    })

    server.on('log', ({ tags, data }) => global.console.log([].concat(tags).join('|'), '>', ...[].concat(data)))

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

    await server.register({ register: require('../lib/index'), options: config.pluginOptions })

    return server
  } catch (err) {
    logMessage(`Failed to build server: ${err.message}\n${err.stack}`)
    // process.exit(1)
  }
}

const fakeAuthPlugin = {
  name: 'myauth',
  register: (server, options, next) => {
    try {
      server.auth.scheme('myauth', (server, options) => {
        const scheme = {
          authenticate: async function(request, reply) {
            const authorization = request.headers.authorization

            if (!authorization) {
              return reply(Boom.unauthorized(null, 'myauth'))
            }

            const { isValid, credentials } = await options.validate(request, authorization, reply)

            if (!isValid) {
              return reply(Boom.unauthorized('Bad user!'), credentials ? { credentials } : null)
            }

            return reply.continue({ credentials })
          }
        }

        return scheme
      })
      next()
    } catch (err) {
      next(err)
    }
  },
  validate: async (request, authorization, h) => {
    if (authorization) {
      return { isValid: true, credentials: { username: 'test' } }
    }

    return { isValid: false }
  }
}

fakeAuthPlugin.register.attributes = { name: fakeAuthPlugin.name }
