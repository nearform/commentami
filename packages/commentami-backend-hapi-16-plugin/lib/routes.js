'use strict'

const Joi = require('joi')

module.exports = {
  name: 'comments',
  register(server, options = {}, next) {
    try {
      const { cors = false, auth = false } = options

      server.route({
        method: 'GET',
        path: '/comments-references/{resource*}',
        handler: function(request, reply, h) {
          const { resource } = request.params

          return reply(request.commentsService.listOnlyReferences(resource))
        },
        config: {
          cors,
          auth,
          validate: {
            params: {
              resource: Joi.string().required()
            }
          },
          tags: ['api', 'commentami'],
          description: 'Get lit of references given a resource'
        }
      })

      server.route({
        method: 'GET',
        path: '/comments',
        handler: function(request, reply, h) {
          const { resource, reference, limit, offset } = request.query

          return reply(request.commentsService.list(resource, reference, { limit, offset }))
        },
        config: {
          cors,
          auth,
          validate: {
            query: {
              resource: Joi.string()
                .min(1)
                .required(),
              reference: Joi.string()
                .min(1)
                .optional(),
              limit: Joi.number()
                .min(1)
                .optional(),
              offset: Joi.number()
                .min(0)
                .optional()
            }
          },
          tags: ['api', 'commentami'],
          description: 'Paginated list of comments'
        }
      })

      server.route({
        method: 'POST',
        path: '/comments',
        handler: async function(request, reply, h) {
          const user = options.getUserFromRequest
            ? await options.getUserFromRequest(request, request.payload)
            : { username: null }
          const payload = Object.assign({}, request.payload, user.username ? { author: '' + user.username } : null)

          return reply(request.commentsService.add(payload))
        },
        config: {
          cors,
          auth,
          validate: {
            payload: {
              resource: Joi.string().required(),
              reference: Joi.string().required(),
              content: Joi.string().required(),
              author: Joi.string().optional()
            }
          },
          tags: ['api', 'commentami'],
          description: 'Create a comment'
        }
      })

      server.route({
        method: 'GET',
        path: '/comments/{id}',
        handler: function(request, reply, h) {
          const { id } = request.params

          return reply(request.commentsService.get(id))
        },
        config: {
          cors,
          auth,
          validate: {
            params: {
              id: Joi.number().required()
            }
          },
          tags: ['api', 'commentami'],
          description: 'Get a comment'
        }
      })

      server.route({
        method: 'PUT',
        path: '/comments/{id}',
        handler: async function(request, reply, h) {
          const { id } = request.params

          return reply(request.commentsService.update(id, request.payload))
        },
        config: {
          cors,
          auth,
          validate: {
            params: {
              id: Joi.number().required()
            },
            payload: {
              content: Joi.string().required()
            }
          },
          tags: ['api', 'commentami'],
          description: 'Update a comment'
        }
      })

      server.route({
        method: 'DELETE',
        path: '/comments/{id}',
        handler: async function(request, reply, h) {
          const { id } = request.params

          await request.commentsService.delete(id)
          return reply({ success: true })
        },
        config: {
          cors,
          auth,
          validate: {
            params: {
              id: Joi.number().required()
            }
          },
          tags: ['api', 'commentami'],
          description: 'Delete a comment'
        }
      })
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports.register.attributes = { name: module.exports.name }
