'use strict'

const config = require('../config')
const { Pool } = require('pg')

let pool
let db

function initDb (conf) {
  if (pool && db) {
    return db
  }

  const dbConfig = conf || config.pg

  pool = new Pool(dbConfig)
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  db = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback)
    },
    stopPool: () => {
      return pool.end()
        .then(() => {
          pool = null
          db = null
        })
    }
  }

  return db
}

module.exports = initDb
