'use strict'

const { test } = require('tap')
const { initPool, initClient } = require('../lib/db')

test('initPool will throw if no configuration is provided', function (t) {
  t.throws(initPool, new Error('Cannot initialize connection without a configuration object'))
  t.end()
})

test('initClient will throw if no configuration is provided', function (t) {
  t.throws(initClient, new Error('Cannot initialize connection without a configuration object'))
  t.end()
})
