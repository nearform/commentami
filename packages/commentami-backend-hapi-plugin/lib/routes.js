'use strict'

const Joi = require('joi')

module.exports = {
  name: 'comments',
  register(server, options = {}) {
    options.cors = options.cors || false

    server.route({
      method: 'GET',
      path: '/comments-references/{resource*}',
      handler: function(request, h) {
        const { resource } = request.params

        return request.commentsService.listOnlyReferences(resource)
      },
      options: {
        cors: options.cors,
        auth: options.auth || false,
        validate: {
          params: {
            resource: Joi.string().required()
          }
        }
      }
    })

    server.route({
      method: 'GET',
      path: '/comments',
      handler: function(request, h) {
        const { resource, reference, limit, offset } = request.query

        return request.commentsService.list(resource, reference, { limit, offset })
      },
      options: {
        cors: options.cors,
        auth: options.auth || false,
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
        }
      }
    })

    server.route({
      method: 'POST',
      path: '/comments',
      handler: async function(request, h) {
        const user = options.getUserFromRequest
          ? await options.getUserFromRequest(request, request.payload)
          : { username: null }
        const payload = Object.assign({}, request.payload, user.username ? { author: '' + user.username } : null)

        return request.commentsService.add(payload)
      },
      options: {
        cors: options.cors,
        auth: options.auth || false,
        validate: {
          payload: {
            resource: Joi.string().required(),
            reference: Joi.string().required(),
            content: Joi.string().required(),
            author: Joi.string().optional()
          }
        }
      }
    })

    server.route({
      method: 'GET',
      path: '/comments/{id}',
      handler: function(request, h) {
        const { id } = request.params

        return request.commentsService.get(id)
      },
      options: {
        cors: options.cors,
        auth: options.auth || false,
        validate: {
          params: {
            id: Joi.number().required()
          }
        }
      }
    })

    server.route({
      method: 'PUT',
      path: '/comments/{id}',
      handler: async function(request, h) {
        const { id } = request.params

        return request.commentsService.update(id, request.payload)
      },
      options: {
        cors: options.cors,
        auth: options.auth || false,
        validate: {
          params: {
            id: Joi.number().required()
          },
          payload: {
            content: Joi.string().required()
          }
        }
      }
    })

    server.route({
      method: 'DELETE',
      path: '/comments/{id}',
      handler: async function(request, h) {
        const { id } = request.params

        await request.commentsService.delete(id)
        return { success: true }
      },
      options: {
        cors: options.cors,
        auth: options.auth || false,
        validate: {
          params: {
            id: Joi.number().required()
          }
        }
      }
    })
  }
}
