'use strict'

const { expect } = require('code')
const Lab = require('lab')
module.exports.lab = Lab.script()
const { describe, it: test, beforeEach, before, after } = module.exports.lab

const { resetDb } = require('../utils')
const config = require('../../config')
const { random, lorem, name, internet } = require('faker')

const { buildPool, buildCommentsService } = require('../../lib')

describe('Comments', () => {
  before(async () => {
    await resetDb()

    const db = buildPool(config.pg)
    this.commentsService = buildCommentsService(db)
  })

  after(() => {
    return this.commentsService.close()
  })

  describe('listing', () => {
    beforeEach(() => {
      this.resource = internet.url()
      this.reference = random.uuid()
      this.references = []

      const comments = new Array(20).fill(0).map((v, i) => {
        const reference = i === 0 ? this.reference : random.uuid()
        this.references.push(reference)

        return {
          resource: this.resource,
          reference,
          content: lorem.words(),
          author: name.firstName()
        }
      })

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
    })

    test('Comments: list all comments will return 100 by default (filtering by resource and reference)', async () => {
      const list = await this.commentsService.list(this.resource, this.reference)

      expect(list).to.include({
        total: 1,
        limit: 100,
        offset: 0
      })

      expect(list.comments.length).to.equal(1)
    })

    test('Comments: can ask for comments using limits and offset', async () => {
      const all = await this.commentsService.list(this.resource)
      const list = await this.commentsService.list(this.resource, { limit: 15, offset: 3 })

      expect(list).to.include({
        total: 20,
        limit: 15,
        offset: 3
      })

      expect(list.comments.length).to.equal(15)
      expect(list.comments[0].id).to.equal(all.comments[3].id)
    })

    test('Comments: asking with no resource will return an empty set', async () => {
      const list = await this.commentsService.list()

      expect(list).to.equal({
        comments: [],
        total: 0,
        limit: 100,
        offset: 0
      })
    })

    test('Comments: list only reference', async () => {
      const list = await this.commentsService.listOnlyReferences(this.resource)

      expect(list).to.include({
        resource: this.resource
      })
      expect(list.references.sort()).to.equal(this.references.sort())
    })
  })

  describe('getting', () => {
    test('should throw an error when a non existing comment is requested', async () => {
      await expect(this.commentsService.get(-1)).to.reject(Error, 'Cannot find comment with id -1')
    })
  })

  describe('adding', () => {
    test('should correctly create a comment', async () => {
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....'
      }

      const result = await this.commentsService.add(comment)

      expect(result.id).to.be.number()
      expect(result).to.include(comment)
    })
  })

  describe('updating', () => {
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
        author: 'Filippo'
      }

      const created = await this.commentsService.add(comment)
      const result = await this.commentsService.update(created.id, commentUpdate)
      expect(result.id).to.be.number()
      expect(result).to.include(expected)
    })

    test('should not allow updating one comment with an empty string', async () => {
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....',
        author: 'Filippo'
      }

      const commentUpdate = {
        content: ''
      }

      const created = await this.commentsService.add(comment)
      const result = await this.commentsService.update(created.id, commentUpdate)
      expect(result).to.include(comment)
    })

    test('should throw an error when a trying to update a non existing comment', async () => {
      const commentUpdate = {
        content: 'new content'
      }

      await expect(this.commentsService.update(-1, commentUpdate)).to.reject(Error, 'Cannot find comment with id -1')
    })
  })

  describe('deleting', () => {
    test('should correctly delete one comment', async () => {
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum ....',
        author: 'Filippo'
      }
      const created = await this.commentsService.add(comment)

      const result = await this.commentsService.delete(created.id)
      expect(result).to.include(comment)
    })

    test('deleting a non existed object should return success', async () => {
      const result = await this.commentsService.delete(123)
      expect(result).to.be.undefined()
    })

    test('deleting without reference should return success', async () => {
      const result = await this.commentsService.delete(null)
      expect(result).to.be.undefined()
    })
  })

  describe('misc', () => {
    test('should not parse empty rows', () => {
      expect(this.commentsService.mapCommentFromDb(null)).to.be.null()
    })
  })
})
