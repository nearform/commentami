'use strict'

const { expect } = require('code')
const Lab = require('lab')

module.exports.lab = Lab.script()
const { describe, it: test } = module.exports.lab

const commentsHapiPlugin = require('../../lib/index')

describe('commentsHapiPlugin', () => {
  test('throws an error if validation fails', async () => {
    const server = {}
    const options = {
      pg: 'I should not be a string'
    }

    await commentsHapiPlugin.register(server, options)
      .catch((e) => {
        expect(e.message).to.equal('child "pg" fails because ["pg" must be an object]')
      })
  })

  test('override pg options', async () => {
    let commentService
    let registerCalled = false
    let extCalled = false

    const server = {
      decorate: (s1, s2, c) => {
        commentService = c
      },
      register: () => {
        registerCalled = true
      },
      ext: () => {
        extCalled = true
      }
    }
    const options = {
      pg: {
        host: 'my.preferred.host.local'
      }
    }

    return commentsHapiPlugin.register(server, options)
      .then(() => {
        expect(commentService).to.exists()
        expect(registerCalled).to.be.true()
        expect(extCalled).to.be.true()
      })
  })
})
