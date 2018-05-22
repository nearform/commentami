'use strict'

const path = require('path')
const Postgrator = require('postgrator')

const config = require('../config')

function migrate (to = 'max', callback) {
  const postgrator = new Postgrator({
    migrationDirectory: path.join(__dirname, '../../migrations'),
    driver: 'pg',
    host: config.pg.host,
    port: config.pg.port,
    database: config.pg.database,
    username: config.pg.user,
    password: config.pg.password,
    schemaTable: 'schemaversion'
  })

  postgrator
    .migrate(to)
    .then(() => callback())
    .catch((err) => callback(err))
}

module.exports = migrate

if (require.main === module) {
  migrate('max', (err, migrations) => {
    /* eslint-disable no-console */
    if (err) {
      console.log('Migrations error!', err)
      process.exit(1)
    }
    console.log('Migrations done!')
    /* eslint-enable */
  })
}
