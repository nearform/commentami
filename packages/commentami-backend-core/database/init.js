'use strict'

const config = require('../config')
const { Client } = require('pg')

async function run() {
  const { host, port, database, user, password } = config.pg
  const client = new Client({ host, port, database: 'postgres', user, password })

  await client.connect()
  await client.query(`DROP DATABASE IF EXISTS ${database}`)
  await client.query(`CREATE DATABASE ${database}`)
  await client.end()
  /* eslint-disable no-console */
  console.log(`\x1b[32m\u2714 Database \x1b[1m${database}\x1b[22m created successfully!\x1b[0m`)
}

run().catch(err => {
  console.error(err) // eslint-disable-line no-console
  process.exit(1)
})
