'use strict'

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
  stopServer
}

