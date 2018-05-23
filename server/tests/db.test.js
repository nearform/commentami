'use strict'

const tap = require('tap')
const { initDb } = require('../src/lib/db')

tap.test('initDb will throw if no configuration is provided', function (t) {
  t.throws(initDb, new Error('Cannot initialize connection without a configuration object'))
  t.end()
})
