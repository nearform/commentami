import { createComment, createReference } from '../../../src/state/helpers/creators'

describe('state/helpers/creators', () => {
  test('Create a reference', () => {
    expect(createReference({ id: 20 })).toEqual({ id: 20, comments: {} })
  })

  test('Create a comment', () => {
    expect(createComment({ id: 'comm-1' })).toEqual({
      content: null,
      id: 'comm-1',
      reference: null,
      author: null,
      createdAt: null
    })

    expect(createComment({ content: 'some content', reference: { id: 'ref-1' } })).toEqual({
      id: null,
      content: 'some content',
      reference: { id: 'ref-1' },
      author: null,
      createdAt: null
    })

    expect(createComment({ content: 'some content', reference: 'ref-1' })).toEqual({
      id: null,
      content: 'some content',
      reference: { id: 'ref-1' },
      author: null,
      createdAt: null
    })
  })
})
