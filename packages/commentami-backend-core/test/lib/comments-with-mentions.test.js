'use strict'

const find = require('lodash/find')
const { expect } = require('code')
const Lab = require('lab')
module.exports.lab = Lab.script()
const { describe, it: test, beforeEach, before, after } = module.exports.lab

const { resetDb, loadDataFromTable } = require('../utils')
const config = require('../../config')
const { random, lorem, name, internet } = require('faker')

const { buildPool, buildCommentsService } = require('../../lib')

describe('Comments - with mentions', () => {
  before(async () => {
    await resetDb()

    const db = buildPool(config.pg)
    this.commentsService = buildCommentsService(db, {
      fetchedComment: async comment => {
        if (comment.mentions && comment.mentions.length > 0) {
          comment.mentions = comment.mentions.map(m => ({
            id: m,
            username: m
          }))
        }

        return comment
      },
      fetchedComments: async list => {
        return list.map(comment => {
          if (comment.mentions && comment.mentions.length > 0) {
            comment.mentions = comment.mentions.map(m => ({
              id: m,
              username: m
            }))
          }

          return comment
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
      this.references = []

      const comments = new Array(20).fill(0).map((v, i) => {
        const reference = i === 0 ? this.reference : random.uuid()
        this.references.push(reference)

        return {
          resource: this.resource,
          reference,
          content: lorem.words() + ' @' + lorem.word(),
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

      expect(list.comments[0].id).to.be.number()
      expect(list.comments[0].mentions).to.be.array()
      expect(list.comments[0].mentions.length).to.equal(1)
      expect(list.comments[0].mentions[0]).to.be.object()
    })

    test('Get single comment', async () => {
      const comment = await this.commentsService.get(1)

      expect(comment.id).to.be.number()
      expect(comment.mentions).to.be.array()
      expect(comment.mentions.length).to.equal(1)
      expect(comment.mentions[0]).to.be.object()
    })
  })

  describe('adding', () => {
    test('should correctly create a comment', async () => {
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum .... @test and then again @test, also @doubletest'
      }

      const result = await this.commentsService.add(comment)

      expect(result.id).to.be.number()
      expect(result).to.include(comment)
      expect(result.mentions).to.equals([
        { id: 'test', username: 'test' },
        { id: 'doubletest', username: 'doubletest' }
      ])
    })
  })

  describe('updating', () => {
    test('should correctly update one comment and its mentions', async () => {
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum .... @test1 @test2',
        author: 'Filippo'
      }
      const commentUpdate = {
        content: 'new comment @mention1 @mention2'
      }

      const created = await this.commentsService.add(comment)
      expect(created.id).to.be.number()
      expect(created.content).to.include(comment.content)
      expect(created.mentions).to.equals([{ id: 'test1', username: 'test1' }, { id: 'test2', username: 'test2' }])

      const result = await this.commentsService.update(created.id, commentUpdate)

      expect(result.id).to.be.number()
      expect(result.content).to.include(commentUpdate.content)
      expect(result.mentions).to.equals([
        { id: 'mention1', username: 'mention1' },
        { id: 'mention2', username: 'mention2' }
      ])
    })

    test('should remove mentions when the content is updated', async () => {
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum .... @test1 @test2',
        author: 'Filippo'
      }
      const commentUpdate = {
        content: 'new comment'
      }

      const created = await this.commentsService.add(comment)
      expect(created.id).to.be.number()
      expect(created.content).to.include(comment.content)
      expect(created.mentions).to.equals([{ id: 'test1', username: 'test1' }, { id: 'test2', username: 'test2' }])

      const result = await this.commentsService.update(created.id, commentUpdate)

      expect(result.id).to.be.number()
      expect(result.content).to.include(commentUpdate.content)
      expect(result.mentions).to.equals([])
    })
  })

  describe('deleting', () => {
    test('should correctly remove mentions from the mention table', async () => {
      const comment = {
        resource: 'http://example.com/example',
        reference: 'uuid-of-some-sort',
        content: 'lorm ipsum .... @test1 @test2',
        author: 'Filippo'
      }
      const created = await this.commentsService.add(comment)
      expect(created.id).to.be.number()
      expect(created.content).to.include(comment.content)
      expect(created.mentions).to.equals([{ id: 'test1', username: 'test1' }, { id: 'test2', username: 'test2' }])

      const result = await this.commentsService.delete(created.id)
      expect(result).to.include(comment)

      const mentions = await loadDataFromTable('mention')
      expect(find(mentions, { comment_id: created.id })).to.be.undefined()
    })
  })
})
