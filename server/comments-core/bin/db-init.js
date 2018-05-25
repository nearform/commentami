#!/usr/bin/env node
'use strict'

const { assign, cloneDeep } = require('lodash')
const conf = require('../config')
const { initClient, killOutstandingConnections, dropDb, createDb } = require('../lib/db')

const initDbConfig = assign({}, cloneDeep(conf.pg), { database: 'postgres' })
const client = initClient(initDbConfig)

const result = (async function () {
  await client.connect()
  if (!conf.isProd) {
    await killOutstandingConnections(client, conf.pg.database)
  }

  await dropDb(client, conf.pg.database)
  await createDb(client, conf.pg.database)
  await client.end()
})()

result
  .then(() => {
    console.info('Db init: done') // eslint-disable-line no-console
  })
  .catch((err) => {
    console.error(err) // eslint-disable-line no-console
    process.exit(1)
  })
