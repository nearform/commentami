'use strict'

const config = require('../config')
const Postgrator = require('postgrator')
const path = require('path')

async function run() {
  const version = process.argv[2]
  const { host, port, database, user, password } = config.pg
  const migrationDirectory = path.join(__dirname, '/migrations')
  if (!version) throw new Error('Please provide the version to migrate to as first command line argument')

  const postgrator = new Postgrator({ driver: 'pg', migrationDirectory, schemaTable: 'schemaversion', host, port, database, user, password })

  await postgrator.migrate(version)
  console.log(`\x1b[32m\u2714 Database \x1b[1m${database}\x1b[22m migrated successfully to version ${version}!\x1b[0m`) // eslint-disable-line no-console
}

run().catch(err => {
  console.error(err) // eslint-disable-line no-console
  process.exit(1)
})
