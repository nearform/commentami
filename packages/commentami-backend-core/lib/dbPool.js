'use strict'

const { Pool } = require('pg')

/**
 * The idea behind this function is to create a wrapper for the connection.
 */
module.exports = function buildPool(conf) {
  if (!conf) {
    throw new Error('Cannot initialize connection without a configuration object')
  }

  const pool = new Pool(conf)
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err) // eslint-disable-line no-console
    process.exit(1)
  })

  return pool
}
