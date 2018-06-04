'use strict'

const { expect } = require('code')
const Lab = require('lab')

module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const buildServer = require('../lib/server')

describe('buildServer', () => {
  let originaExit

  before(() => {
    originaExit = process.exit
  })

  after(() => {
    process.exit = originaExit
  })

  test('when the server construction fails an error is logged and the process is stopped', async () => {
    let done
    let error

    const p = new Promise((resolve, reject) => {
      done = resolve
      error = reject
    })

    process.exit = (code) => {
      expect(code).to.equal(1)
      done()
    }

    const logMessage = (err) => {
      expect(err).to.include('Cannot create property')
    }

    await buildServer({ server: 'not valid string' }, logMessage)
      .catch((err) => {
        error(err)
      })
    await p
  })
})
