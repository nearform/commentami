'use strict'

const _ = require('lodash')
const async = require('async')
const SQL = require('@nearform/sql')

const dbMigrate = require('../bin/db-migrate')
const { initClient, killOutstandingConnections, createDb, resetTables } = require('../lib/db')

module.exports = function resetDb (conf, done) {
  const initDbConfig = _.assign({}, _.cloneDeep(conf), { database: 'postgres' })
  var postgresClient = initClient(initDbConfig)
  var commentsClient = initClient(conf)
  var databaseExists = false

  async.series(
    [
      (next) => postgresClient.connect(next),
      (next) => {
        // If the db exists we kill the generic client and connect directly to the db
        postgresClient.query(SQL`SELECT * FROM pg_database WHERE datname=${conf.database}`, (err, res) => {
          if (err) return next(err)

          databaseExists = res.rowCount >= 1
          next()
        })
      },
      (next) => { !databaseExists ? killOutstandingConnections(postgresClient, conf.database, next) : next() },
      (next) => { !databaseExists ? createDb(postgresClient, conf.database, next) : next() },
      (next) => { databaseExists ? commentsClient.connect(next) : next() },
      (next) => { databaseExists ? resetTables(commentsClient, next) : next() },
      (next) => { databaseExists ? commentsClient.end(next) : next() },
      (next) => postgresClient.end(next),
      (next) => dbMigrate('max', next)
    ],
    done
  )
}
