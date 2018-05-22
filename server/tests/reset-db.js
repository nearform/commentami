'use strict'

const dbInit = require('../src/utils/db-init')
const dbMigrate = require('../src/utils/db-migrate')

module.exports = function resetDb (done) {
  dbInit((err) => {
    if (err) return done(err)
    dbMigrate('max', (err) => {
      if (err) return done(err)
      done()
    })
  })
}
