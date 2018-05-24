'use strict'

const Joi = require('joi')

const routes = []

routes.push({
  method: 'GET',
  path: '/comments',
  handler: async function (request, h) {
    const { reference, limit, offset } = request.query

    return request.commentsService.list(reference, { limit, offset })
  },
  options: {
    validate: {
      query: {
        reference: Joi.string().min(1).required(),
        limit: Joi.number().min(1).optional(),
        offset: Joi.number().min(0).optional()
      }
    }
  }
})

routes.push({
  method: 'POST',
  path: '/comments',
  handler: function (request, h) {
    return request.commentsService.add(request.payload)
  },
  options: {
    validate: {
      payload: {
        reference: Joi.string().required(),
        content: Joi.string().required(),
        author: Joi.string().required()
      }
    }
  }
})

routes.push({
  method: 'PUT',
  path: '/comments/{id}',
  handler: function (request, h) {
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

routes.push({
  method: 'DELETE',
  path: '/comments/{id}',
  handler: function (request, h) {
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

module.exports = routes
