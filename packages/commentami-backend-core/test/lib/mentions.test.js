'use strict'

const { expect } = require('code')
const Lab = require('lab')
module.exports.lab = Lab.script()
const { describe, it: test } = module.exports.lab

const mentions = require('../../lib/mentions')

describe('Mentions', () => {
  test('should correctly extract mentions', async () => {
    expect(mentions.parse()).to.equal([])
    expect(mentions.parse(null)).to.equal([])
    expect(mentions.parse('')).to.equal([])
    expect(mentions.parse('My test without mentions')).to.equal([])
    expect(mentions.parse('My test with @test and @test2 mentions')).to.equal(['test', 'test2'])
    expect(mentions.parse('My test with @test, @test2 and @test3 mentions')).to.equal(['test', 'test2', 'test3'])

    expect(
      mentions.parse(`
      @myMentions will accept upper case\n
      it will not accept dashes @mentionUntilHere-noThisone\n
      it will accept numbers @12345 @test123\n
      it will accept undescors @1_a_b_test_12
    `)
    ).to.equal(['myMentions', 'mentionUntilHere', '12345', 'test123', '1_a_b_test_12'])

    expect(
      mentions.parse(`
      if I mention @test multiple times @test @test @test\n
      it will return only one mention of @test
    `)
    ).to.equal(['test'])

    expect(
      mentions.parse(`
      if I mention test@test.com I should not get the mention
    `)
    ).to.equal([])
  })
})
