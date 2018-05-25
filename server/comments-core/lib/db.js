'use strict'

const { Pool, Client } = require('pg')

/**
 * The idea behind this function is to create a wrapper for the connection.
 */
function initPool (conf) {
  if (!conf) {
    throw new Error('Cannot initialize connection without a configuration object')
  }

  const pool = new Pool(conf)
  // the pool with emit an error on behalf of any idle clients
  // it contains if a backend error or network partition happens
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err) // eslint-disable-line no-console
    process.exit(-1)
  })

  return pool
}

function initClient (conf) {
  if (!conf) {
    throw new Error('Cannot initialize connection without a configuration object')
  }

  return new Client(conf)
}

function killOutstandingConnections (client, databaseName) {
  return client.query(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${databaseName}' AND pid <> pg_backend_pid()`)
}

function dropDb (client, databaseName) {
  return client.query(`DROP DATABASE IF EXISTS "${databaseName}"`)
}

function createDb (client, databaseName) {
  return client.query(`CREATE DATABASE "${databaseName}"`)
}

async function resetTables (client) {
  await client.query(`DROP SCHEMA public CASCADE`)
  await client.query(`CREATE SCHEMA public`)
  await client.query(`GRANT ALL ON SCHEMA public TO postgres`)
  await client.query(`GRANT ALL ON SCHEMA public TO public`)
}

module.exports = {
  initPool,
  initClient,
  killOutstandingConnections,
  dropDb,
  createDb,
  resetTables
}
