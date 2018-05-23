'use strict'

const tap = require('tap')
const { initPool, initClient } = require('../lib/db')

tap.test('initPool will throw if no configuration is provided', function (t) {
  t.throws(initPool, new Error('Cannot initialize connection without a configuration object'))
  t.end()
})

tap.test('initClient will throw if no configuration is provided', function (t) {
  t.throws(initClient, new Error('Cannot initialize connection without a configuration object'))
  t.end()
})
