'use strict'

const faker = require('faker')

const config = require('../config')
const { initPool } = require('../lib/db')
const initCommentsService = require('../lib/comments')

async function loadComments (options = {}) {
  const { number = 20, reference = undefined } = options
  const comments = (new Array(number)).fill(null).map(v => {
    return {
      reference: reference || faker.random.uuid(),
      content: faker.lorem.words(),
      author: faker.name.firstName()
    }
  })

  const db = initPool(config.pg)
  const commentsService = initCommentsService(db)
  const promises = comments.map(comment => commentsService.add(comment))

  await Promise.all(promises)
  await commentsService.close()
}

module.exports = loadComments
