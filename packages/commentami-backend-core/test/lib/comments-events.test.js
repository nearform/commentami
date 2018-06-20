'use strict'

const { expect } = require('code')
const Lab = require('lab')
module.exports.lab = Lab.script()
const { describe, it: test, before, after, afterEach } = module.exports.lab

const { resetDb } = require('../utils')
const config = require('../../config')

const { buildPool, buildCommentsService } = require('../../lib')

describe('Comments events', () => {
  before(async () => {
    await resetDb()

    const db = buildPool(config.pg)
    this.commentsService = buildCommentsService(db)
  })

  after(() => {
    return this.commentsService.close()
  })

  afterEach(() => {
    this.commentsService.removeAllListeners('add')
    this.commentsService.removeAllListeners('update')
    this.commentsService.removeAllListeners('delete')
  })

  describe('adding', () => {
    test('should correctly create a comment', async () => {
      let done
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....',
        author: 'davide'
      }

      const expected = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....',
        author: { id: 'davide' }
      }

      const p = new Promise(resolve => {
        done = resolve
      })

      this.commentsService.on('add', c => {
        expect(c.id).to.be.number()
        expect(c).to.include(expected)

        done()
      })

      await this.commentsService.add(comment)
      await p
    })
  })

  describe('updating', () => {
    let done
    test('should correctly update one comment', async () => {
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....',
        author: 'Filippo'
      }
      const commentUpdate = {
        content: 'new comment'
      }
      const expected = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'new comment',
        author: { id: 'Filippo' }
      }

      const p = new Promise((resolve, reject) => {
        done = resolve
      })

      this.commentsService.on('update', c => {
        expect(c).to.include(expected)

        done()
      })

      const created = await this.commentsService.add(comment)
      await this.commentsService.update(created.id, commentUpdate)
      await p
    })
  })

  describe('deleting', () => {
    test('should correctly delete one comment', async () => {
      let done
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....',
        author: 'Filippo'
      }

      const expected = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....',
        author: { id: 'Filippo' }
      }

      const p = new Promise((resolve, reject) => {
        done = resolve
      })

      this.commentsService.on('delete', c => {
        expect(c).to.include(expected)

        done()
      })

      const created = await this.commentsService.add(comment)
      await this.commentsService.delete(created.id)
      await p
    })
  })
})
