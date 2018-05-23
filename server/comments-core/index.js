'use strict'

const config = require('./config')
const buildCommentsService = require('./lib/comments')
const { initPool } = require('./lib/db')

module.exports = {
  buildCommentsService,
  initPool,
  config
}
