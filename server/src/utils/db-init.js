'use strict'

const _ = require('lodash')
const async = require('async')
const pg = require('pg')
const conf = require('../config')

let config
let client
let databaseName

function createClient (next) {
  try {
    databaseName = conf.pg.database
    config = _.cloneDeep(conf)
    /**
     * This is a override for use in testing to connect to PostgreSQL if you do not have a specific db.
     * @see https://github.com/olalonde/pgtools/blob/master/index.js#L43
     */
    config.pg.database = 'postgres'

    client = new pg.Client(config.pg)
    next()
  } catch (e) {
    next(e)
  }
}

function connect (next) {
  client.connect(next)
}

function killOutstandingConnections (next) {
  client.query(
    `SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${databaseName}' AND pid <> pg_backend_pid()`,
    function (err) {
      if (err) return next(err)

      next()
    }
  )
}

function dropDb (next) {
  if (config.isProd) {
    return next()
  }

  client.query(`DROP DATABASE IF EXISTS "${databaseName}"`, function (err) {
    if (err) return next(err)

    next()
  })
}

function createDb (next) {
  client.query(`CREATE DATABASE "${databaseName}"`, function (err) {
    if (err) return next(err)

    next()
  })
}

function init (cb) {
  const start = (new Date()).getTime()
  async.series(
    [createClient, connect, killOutstandingConnections, dropDb, createDb],
    function (err1) {
      // eslint-disable-next-line no-console
      if (err1) console.error(err1)

      client.end(function (err2) {
        cb(err1 || err2)
      })

      const totalTime = (new Date()).getTime() - start
      if (totalTime > 1000) {
        // eslint-disable-next-line no-console
        console.log(`It's taking ${Math.round(totalTime / 10) / 100} seconds to init the db`)
      }
    }
  )
}

module.exports = init

if (require.main === module) {
  init(err => {
    if (err) throw err
    else {
      // eslint-disable-next-line no-console
      console.info('Db init: done')
    }
  })
}
