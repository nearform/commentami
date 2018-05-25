#!/usr/bin/env node
'use strict'

const { assign, cloneDeep } = require('lodash')
const async = require('async')
const conf = require('../config')
const { initClient, killOutstandingConnections, dropDb, createDb } = require('../lib/db')

const initDbConfig = assign({}, cloneDeep(conf.pg), { database: 'postgres' })
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
      console.error(err) // eslint-disable-line no-console
      process.exit(1)
    }

    console.info('Db init: done') // eslint-disable-line no-console
  }
)
