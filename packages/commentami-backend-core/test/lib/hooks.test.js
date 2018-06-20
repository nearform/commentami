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
            comment.author = Object.assign({}, comment.author, {
              firstName: 'Test',
              email: 'example@example.com'
            })

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
                author: Object.assign({}, item.author, {
                  firstName: 'Test',
                  email: 'example@example.com'
                })
              }))
            )
          }, 10)
        })
      },
      involvedUsers: async users => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              users.map(item => ({
                id: item.id,
                username: `username-${item.id}`
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
      expect(list.comments[0].author).to.include({
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
        author: 'Filippo'
      }

      const expected = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....',
        author: { id: 'Filippo', firstName: 'Test', email: 'example@example.com' }
      }

      const result = await this.commentsService.add(comment)

      expect(result.id).to.be.number()
      expect(result).to.include(expected)
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
        author: 'Filippo'
      }

      const created = await this.commentsService.add(comment)
      const result = await this.commentsService.delete(created.id)

      expect(result.id).to.equal(created.id)
      expect(result.author).to.equal({
        id: 'Filippo',
        firstName: 'Test',
        email: 'example@example.com'
      })
    })
  })

  describe('getInvolvedUsers', () => {
    test('should return the right list of users with additional data', async () => {
      const resource = 'http://example.com/example'
      const reference = 'reference-uuid'
      const content = 'lorm ipsum ....'

      await this.commentsService.add({
        resource,
        reference,
        content,
        author: 'Filippo'
      })
      await this.commentsService.add({
        resource,
        reference,
        content,
        author: 'Davide'
      })
      const comment1 = await this.commentsService.add({
        resource,
        reference: 'another-uuid-of-some-sort',
        content,
        author: 'Paolo'
      })

      const comment2 = await this.commentsService.add({
        resource,
        reference,
        content,
        author: 'Filippo'
      })

      let expected = [{ id: 'Paolo', username: 'username-Paolo' }]
      let result = await this.commentsService.getInvolvedUsers(comment1)
      expect(result).to.once.include(expected)
      expect(result).to.only.include(expected)

      expected = [{ id: 'Davide', username: 'username-Davide' }, { id: 'Filippo', username: 'username-Filippo' }]
      result = await this.commentsService.getInvolvedUsers(comment2)
      expect(result).to.once.include(expected)
      expect(result).to.only.include(expected)
    })
  })
})
