'use strict'

const { expect } = require('code')
const Lab = require('lab')
module.exports.lab = Lab.script()
const { describe, it: test, beforeEach, before, after } = module.exports.lab

const { resetDb } = require('../utils')
const config = require('../../config')
const { random, lorem, name, internet } = require('faker')

const { buildPool, buildCommentsService } = require('../../lib')

describe('Hooks', () => {
  before(async () => {
    await resetDb()

    const db = buildPool(config.pg)
    this.commentsService = buildCommentsService(db, {
      fetchedComment: async comment => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            comment.additionalInfo = {
              firstName: 'Test',
              email: 'example@example.com'
            }

            resolve(comment)
          }, 10)
        })
      },
      fetchedComments: async list => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              list.map(item => ({
                ...item,
                additionalInfo: {
                  firstName: 'Test',
                  email: 'example@example.com'
                }
              }))
            )
          }, 10)
        })
      }
    })
  })

  after(() => {
    return this.commentsService.close()
  })

  describe('listing', () => {
    beforeEach(() => {
      this.resource = internet.url()
      this.reference = random.uuid()

      const comments = new Array(20).fill(0).map((v, i) => ({
        resource: this.resource,
        reference: i === 0 ? this.reference : random.uuid(),
        content: lorem.words(),
        author: name.firstName()
      }))

      return Promise.all(comments.map(comment => this.commentsService.add(comment)))
    })

    test('Comments: list all comments will return 100 by default (filtering only by resource)', async () => {
      const list = await this.commentsService.list(this.resource)

      expect(list).to.include({
        total: 20,
        limit: 100,
        offset: 0
      })

      expect(list.comments.length).to.equal(20)
      expect(list.comments[0].additionalInfo).to.equal({
        firstName: 'Test',
        email: 'example@example.com'
      })
    })
  })

  describe('adding', () => {
    test('should correctly create a comment', async () => {
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....',
        author: 'Filippo',
        additionalInfo: {
          firstName: 'Test',
          email: 'example@example.com'
        }
      }

      const result = await this.commentsService.add(comment)

      expect(result.id).to.be.number()
      expect(result).to.include(comment)
    })
  })

  describe('updating', () => {
    test('should correctly update a comment', async () => {
      const comment = {
        content: 'lorm ipsum .... new'
      }

      const result = await this.commentsService.update(1, comment)

      expect(result.id).to.equal(1)
      expect(result.content).to.equal('lorm ipsum .... new')
    })
  })

  describe('single comment', () => {
    test('should correctly create a comment', async () => {
      const result = await this.commentsService.get(1)

      expect(result.id).to.equal(1)
    })
  })

  describe('delete', () => {
    test('should correctly delete a comment', async () => {
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....',
        author: 'Filippo',
        additionalInfo: {
          firstName: 'Test',
          email: 'example@example.com'
        }
      }

      const created = await this.commentsService.add(comment)
      const result = await this.commentsService.delete(created.id)

      expect(result.id).to.equal(created.id)
      expect(result.additionalInfo).to.equal({
        firstName: 'Test',
        email: 'example@example.com'
      })
    })
  })
})
