'use strict'

const { expect } = require('code')
const Lab = require('lab')
module.exports.lab = Lab.script()
const { describe, it: test, before, after } = module.exports.lab

const { resetDb } = require('../utils')
const config = require('../../config')
const { random, lorem, name, internet } = require('faker')

const { buildPool, buildCommentsService } = require('../../lib')

describe('SQL injection test', () => {
  before(async () => {
    await resetDb()

    const db = buildPool(config.pg)
    this.commentsService = buildCommentsService(db)

    const comments = new Array(20).fill(0).map((v, i) => ({
      resource: internet.url(),
      reference: random.uuid(),
      content: lorem.words(),
      author: name.firstName()
    }))

    return Promise.all(comments.map(comment => this.commentsService.add(comment)))
  })

  after(() => {
    return this.commentsService.close()
  })

  test('Determining if a db is postgres', async () => {
    const list = await this.commentsService.list('1 AND 1::int=1')

    expect(list).to.equal({
      comments: [],
      total: 0,
      limit: 100,
      offset: 0
    })
  })

  test('Determining the db version', async () => {
    const list = await this.commentsService.list('1 UNION ALL SELECT NULL,version(),NULL LIMIT 1 OFFSET 1--')

    expect(list).to.equal({
      comments: [],
      total: 0,
      limit: 100,
      offset: 0
    })
  })

  test('Determining the current user (1)', async () => {
    const list = await this.commentsService.list('1 UNION ALL SELECT user,NULL,NULL--')

    expect(list).to.equal({
      comments: [],
      total: 0,
      limit: 100,
      offset: 0
    })
  })

  test('Determining the current user (2)', async () => {
    const list = await this.commentsService.list('1 UNION ALL SELECT current_user, NULL, NULL--')

    expect(list).to.equal({
      comments: [],
      total: 0,
      limit: 100,
      offset: 0
    })
  })
})
