#!/usr/bin/env node
'use strict'

const path = require('path')
const Postgrator = require('postgrator')

const config = require('../config')

function migrate (to = 'max') {
  const postgrator = new Postgrator({
    migrationDirectory: path.join(__dirname, '../migrations'),
    driver: 'pg',
    host: config.pg.host,
    port: config.pg.port,
    database: config.pg.database,
    username: config.pg.user,
    password: config.pg.password,
    schemaTable: 'schemaversion'
  })

  return postgrator.migrate(to)
}

module.exports = migrate

if (require.main === module) {
  migrate('max')
    .then(() => {
      console.log('Migrations done!') // eslint-disable-line no-console
    })
    .catch((err) => {
      console.log('Migrations error!', err) // eslint-disable-line no-console
      process.exit(1)
    })
}
