'use strict'

const { expect } = require('code')
const Lab = require('lab')
module.exports.lab = Lab.script()
const { describe, it: test } = module.exports.lab
const sinon = require('sinon')

const config = require('../../config')
const buildPool = require('../../lib/dbPool')

describe('buildPool', () => {
  test('should require a configuration to work', () => {
    expect(buildPool).to.throw(Error, 'Cannot initialize connection without a configuration object')
  })

  test('should handle pg error', async () => {
    const spy = sinon.stub(process, 'exit')
    const errorStub = sinon.stub(console, 'error')

    const db = await buildPool(config.pg)
    db.emit('error')

    expect(spy.withArgs(1).called).to.be.true()
    errorStub.restore()
  })
})
