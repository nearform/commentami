'use strict'

const config = require('../config')
const { Pool } = require('pg')
const pool = new Pool(config.pg)

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = {
  query: (text, params, callback) => {
    pool.query(text, params, callback)
  },
  stopPool: () => {
    pool.end()
  }
}
