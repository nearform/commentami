'use strict'

const { assign, cloneDeep } = require('lodash')
const SQL = require('@nearform/sql')

const dbMigrate = require('../bin/db-migrate')
const { initClient, killOutstandingConnections, createDb, resetTables } = require('../lib/db')

module.exports = async function resetDb (conf) {
  const initDbConfig = assign({}, cloneDeep(conf), { database: 'postgres' })
  var postgresClient = initClient(initDbConfig)
  var commentsClient = initClient(conf)

  await postgresClient.connect()
  const res = await postgresClient.query(SQL`SELECT * FROM pg_database WHERE datname=${conf.database}`)
  const databaseExists = res.rowCount >= 1

  if (!databaseExists) {
    await killOutstandingConnections(postgresClient, conf.database)
    await createDb(postgresClient, conf.database)
    await postgresClient.end()

    return
  }

  await commentsClient.connect()
  await resetTables(commentsClient)
  await commentsClient.end()
  await postgresClient.end()
  await dbMigrate('max')
}
