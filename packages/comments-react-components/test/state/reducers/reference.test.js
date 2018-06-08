import { createComment } from '../../../src/state/reducers/comment'
import { createReference, removeComment, setComment } from '../../../src/state/reducers/reference'

describe('state/reducers/Reference', () => {
  test('Add a comment to a reference', () => {
    const reference = createReference({ id: 'ref-1' })

    expect(setComment(reference, createComment({ id: 'comm-1' }))).toEqual({
      id: 'ref-1',
      comments: {
        'comm-1': {
          id: 'comm-1',
          content: null,
          reference: { id: 'ref-1' },
          author: null,
          createdAt: null
        }
      }
    })
  })

  test('Remove a comment', () => {
    let reference = createReference({ id: 'ref-1' })

    reference = setComment(reference, createComment({ id: 'comm-1' }))
    reference = setComment(reference, createComment({ id: 'comm-2' }))
    reference = setComment(reference, createComment({ id: 'comm-3' }))

    expect(removeComment(reference, { id: 'comm-2' })).toEqual({
      id: 'ref-1',
      comments: {
        'comm-1': {
          content: null,
          id: 'comm-1',
          reference: { id: 'ref-1' },
          author: null,
          createdAt: null
        },
        'comm-3': {
          content: null,
          id: 'comm-3',
          reference: { id: 'ref-1' },
          author: null,
          createdAt: null
        }
      }
    })
  })
})
