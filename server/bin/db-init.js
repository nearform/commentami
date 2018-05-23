'use strict'

const _ = require('lodash')
const async = require('async')
const conf = require('../config')
const { initClient, killOutstandingConnections, dropDb, createDb } = require('../src/lib/db')

const initDbConfig = _.assign({}, _.cloneDeep(conf.pg), { database: 'postgres' })
const client = initClient(initDbConfig)

async.series(
  [
    (next) => client.connect(next),
    (next) => { !conf.isProd ? killOutstandingConnections(client, conf.pg.database, next) : next() },
    (next) => dropDb(client, conf.pg.database, next),
    (next) => createDb(client, conf.pg.database, next),
    (next) => client.end(next)
  ],
  (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.info('Db init: done')
  }
)
