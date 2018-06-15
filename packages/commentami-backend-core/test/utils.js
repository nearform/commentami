'use strict'

const path = require('path')
const SQL = require('@nearform/sql')
const Postgrator = require('postgrator')

const config = require('../config')
const buildPool = require('../lib/dbPool')

module.exports = { resetDb, loadDataFromTable }

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

async function loadDataFromTable(table) {
  const pool = buildPool(config.pg)

  const result = await pool.query(`SELECT * FROM ${table}`)
  await pool.end()

  return result.rows
}

async function checkDatabaseExists(pool, database) {
  // if the databse do not exists the query will throw because we are connectiong on that db in config.pg
  return pool.query(SQL`SELECT * FROM pg_database WHERE datname=${database}`)
}

async function resetTables(pool) {
  await pool.query(`DROP TABLE IF EXISTS schemaversion CASCADE`)
  await pool.query(`DROP TABLE IF EXISTS comment CASCADE`)
  await pool.query(`DROP TABLE IF EXISTS mention CASCADE`)
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
