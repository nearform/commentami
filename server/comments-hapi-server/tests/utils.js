'use strict'

const config = require('../../comments-core/config')
const resetDb = require('../../comments-core/tests/reset-db')
const loadComments = require('../../comments-core/tests/load-comments')

const { setupServer } = require('../server.js')
let s

async function getServer () {
  if (s) return s

  s = await setupServer()

  return s
}

async function stopServer () {
  if (!s) {
    return
  }

  await s.stop()
  s = null
}

module.exports = {
  getServer,
  stopServer,
  resetDb: async () => resetDb(config.pg),
  loadComments
}

