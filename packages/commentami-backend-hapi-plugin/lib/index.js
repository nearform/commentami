'use strict'

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
  name: 'comments-hapi-plugin',
  version: '1.0.0',
  register: async function(server, options = {}) {
    const result = Joi.validate(options, schema, { allowUnknown: true })
    if (result.error) {
      throw result.error
    }

    const db = buildPool(Object.assign({}, config.pg, options.pg))
    const commentsService = buildCommentsService(db, options.hooks)

    server.decorate('server', 'commentsService', commentsService)
    server.decorate('request', 'commentsService', commentsService)

    if (options.notifications) {
      server.decorate('server', 'notifications', options.notifications)
    }

    if (options.multines) {
      await server.register([
        {
          plugin: Nes,
          options: options.nes
        },
        {
          plugin: {
            name: 'multines',
            register: Multines.register
          },
          options: options.multines
        }
      ])

      server.subscriptionFar('/resources/{resource*}')
      server.subscriptionFar('/resources-reference/{reference}/{resource*}')
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

    await server.register({ plugin: require('./routes'), options: options.routes })

    server.ext('onPostStop', async () => {
      commentsService.removeAllListeners('add')
      commentsService.removeAllListeners('update')
      commentsService.removeAllListeners('delete')

      await commentsService.close()
    })
  }
}

module.exports = commentsHapiPlugin
