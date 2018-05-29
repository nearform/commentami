'use strict'

const Joi = require('joi')

module.exports = {
  name: 'comments',
  register(server, options) {
    server.route({
      method: 'GET',
      path: '/comments-references/{resource*}',
      handler: function(request, h) {
        const { resource } = request.params

        return request.commentsService.listOnlyReferences(resource)
      },
      options: {
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
      handler: function(request, h) {
        return request.commentsService.add(request.payload)
      },
      options: {
        validate: {
          payload: {
            resource: Joi.string().required(),
            reference: Joi.string().required(),
            content: Joi.string().required(),
            author: Joi.string().required()
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
      handler: function(request, h) {
        const { id } = request.params

        return request.commentsService.update(id, request.payload)
      },
      options: {
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
      handler: function(request, h) {
        const { id } = request.params

        return request.commentsService.delete(id)
      },
      options: {
        validate: {
          params: {
            id: Joi.number().required()
          }
        }
      }
    })
  }
}
