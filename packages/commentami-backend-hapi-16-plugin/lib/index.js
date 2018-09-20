'use strict'

const { name, version } = require('../package.json')
const Joi = require('joi')
const Nes = require('nes')
const Multines = require('multines')
const { buildCommentsService, buildPool, config } = require('@nearform/commentami-backend-core')
const { notifyComment, notifyUser } = require('./subscriptions')

const schema = Joi.object({
  pg: Joi.object().optional(),
  hooks: Joi.object({
    fetchedComment: Joi.func().optional(),
    fetchedComments: Joi.func().optional()
  }).optional(),
  multines: Joi.object({
    type: Joi.string()
      .valid(['redis', 'mongo'])
      .optional()
  }).optional()
})

const commentsHapiPlugin = {
  name,
  version,
  register: async function(server, options = {}, next) {
    try {
      const result = Joi.validate(options, schema, { allowUnknown: true })
      if (result.error) {
        throw result.error
      }

      const db = buildPool(Object.assign({}, config.pg, options.pg))
      const commentsService = buildCommentsService(db, options.hooks)

      server.decorate('server', 'commentsService', commentsService)
      server.decorate('request', 'commentsService', commentsService)

      if (options.multines) {
        await server.register([
          {
            register: Nes,
            options: options.nes
          },
          {
            register: {
              name: 'multines',
              register: Multines.register
            },
            options: options.multines
          }
        ])

        server.subscriptionFar('/resources/{resource*}')
        server.subscriptionFar('/resources-reference/{reference}/{resource*}')
        server.subscriptionFar('/users/{user*}')
        server.method('notifyComment', notifyComment.bind(server))
        server.method('notifyUser', notifyUser.bind(server))

        server.commentsService.on('add', comment => {
          server.methods.notifyComment(comment, { action: 'add' })
          server.methods.notifyUser(comment, options.resolvers && options.resolvers.resolveUrl)
        })
        server.commentsService.on('update', comment => {
          server.methods.notifyComment(comment, { action: 'update' })
        })
        server.commentsService.on('delete', comment => {
          server.methods.notifyComment(comment, { action: 'delete' })
        })
      }

      await server.register({ register: require('./routes'), options: options.routes })

      server.ext('onPostStop', async () => {
        commentsService.removeAllListeners('add')
        commentsService.removeAllListeners('update')
        commentsService.removeAllListeners('delete')

        await commentsService.close()
      })
      next()
    } catch (err) {
      next(err)
    }
  }
}

commentsHapiPlugin.register.attributes = { name, version }

module.exports = commentsHapiPlugin
