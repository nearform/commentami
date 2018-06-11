'use strict'

const path = require('path')
const SQL = require('@nearform/sql')
const Postgrator = require('postgrator')

const config = require('../config')
const buildPool = require('../lib/dbPool')

module.exports = { resetDb }

async function resetDb() {
  if (!config.isTest) {
    console.log('Cannot run resetDb if not on testing env') // eslint-disable-line no-console
    process.exit(1)
  }

  try {
    const pool = buildPool(config.pg)

    await checkDatabaseExists(pool, config.pg.database)
    await resetTables(pool)
    await pool.end()
    await runMigrations(config.pg)
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
    process.exit(1)
  }
}

async function checkDatabaseExists(pool, database) {
  // if the databse do not exists the query will throw because we are connectiong on that db in config.pg
  return pool.query(SQL`SELECT * FROM pg_database WHERE datname=${database}`)
}

async function resetTables(pool) {
  await pool.query(`DROP TABLE IF EXISTS schemaversion`)
  await pool.query(`DROP TABLE IF EXISTS comment`)
}

async function runMigrations(conf) {
  const postgrator = new Postgrator({
    migrationDirectory: path.join(__dirname, '../database/migrations'),
    driver: 'pg',
    host: conf.host,
    port: conf.port,
    database: conf.database,
    username: conf.user,
    password: conf.password,
    schemaTable: 'schemaversion'
  })

  await postgrator.migrate('max')
}
