'use strict'

const tap = require('tap')

const resetDb = require('./reset-db')
const comments = require('../src/comments')
const { stopPool } = require('../src/lib/db')

tap.beforeEach(resetDb)

tap.test('Comments: adding a comment will trigger the addedComment hook', function (t) {
  const comment = {
    reference: 'uuid-of-some-sort',
    comment: 'lorm ipsum ....',
    author: 'Filippo'
  }

  comments.add(comment, (err, result) => {
    t.notOk(err, 'error returned when adding a comment')
    t.ok(result, 'result is empty')

    const expected = {
      id: 1,
      reference: 'uuid-of-some-sort',
      comment: 'lorm ipsum ....',
      author: 'Filippo'
    }
    t.same(result, expected, 'result is not as expected')

    t.end()
  })
})

tap.teardown(() => {
  stopPool()
})
