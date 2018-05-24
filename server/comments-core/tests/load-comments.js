'use strict'

const _ = require('lodash')
const async = require('async')
const faker = require('faker')

const config = require('../config')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

const db = initPool(config.pg)
const commentsService = initCommentsService(db)

function loadComments (options = {}, done) {
  if (_.isFunction(options) && !done) {
    done = options
    options = {}
  }

  const { number = 20, reference = undefined } = options
  const comments = (new Array(number)).fill(null).map(v => {
    return {
      reference: reference || faker.random.uuid(),
      content: faker.lorem.words(),
      author: faker.name.firstName()
    }
  })

  async.series(comments.map(comment => async () => commentsService.add(comment)), async () => {
    await commentsService.close()
    done()
  })
}

module.exports = loadComments
