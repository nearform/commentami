'use strict'

const _ = require('lodash')
const async = require('async')

const dbMigrate = require('../bin/db-migrate')
const { initClient, killOutstandingConnections, dropDb, createDb } = require('../lib/db')

module.exports = function resetDb (conf, done) {
  const initDbConfig = _.assign({}, _.cloneDeep(conf), { database: 'postgres' })
  const client = initClient(initDbConfig)

  async.series(
    [
      (next) => client.connect(next),
      (next) => killOutstandingConnections(client, conf.database, next),
      (next) => dropDb(client, conf.database, next),
      (next) => createDb(client, conf.database, next),
      (next) => client.end(next),
      (next) => dbMigrate('max', next)
    ],
    done
  )
}
