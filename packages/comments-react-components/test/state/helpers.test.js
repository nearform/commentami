import deepFreeze from 'deep-freeze'
import {
  getDefaultState,
  setCommentToReference,
  setReference,
  createReference,
  createComment,
  removeReference,
  removeComment,
  setCommentToState,
  removeCommentFromState
} from '../../src/state/helpers'

describe('state/helpers', () => {
  test('Init the state', () => {
    expect(getDefaultState('res-1')).toEqual({ id: 'res-1', references: {} })
  })

  describe('References', () => {
    test('Create a reference', () => {
      expect(createReference({ id: 20 })).toEqual({ id: 20, comments: {} })
    })

    test('Add a reference to the state', () => {
      let state = getDefaultState('res-1')
      deepFreeze(state)

      expect(setReference(state, { id: 10 })).toEqual({
        id: 'res-1',
        references: { '10': { comments: {}, id: 10 } }
      })
    })

    test('Remove a reference', () => {
      let state = getDefaultState('res-1')
      state = setReference(state, { id: 'ref-1' })
      state = setReference(state, { id: 'ref-2' })
      state = setReference(state, { id: 'ref-3' })
      deepFreeze(state)

      expect(removeReference(state, { id: 'ref-1' })).toEqual({
        id: 'res-1',
        references: {
          'ref-2': { comments: {}, id: 'ref-2' },
          'ref-3': { comments: {}, id: 'ref-3' }
        }
      })
    })
  })

  describe('Comments', () => {
    test('Create a comment', () => {
      expect(createComment({ id: 'comm-1' })).toEqual({
        content: null,
        id: 'comm-1',
        reference: null,
        author: null,
        createdAt: null
      })

      expect(createComment({ content: 'some content', reference: 'ref-1' })).toEqual({
        id: null,
        content: 'some content',
        reference: 'ref-1',
        author: null,
        createdAt: null
      })
    })

    test('Add a comment to a reference', () => {
      const reference = createReference({ id: 'ref-1' })

      expect(setCommentToReference(reference, createComment({ id: 'comm-1' }))).toEqual({
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

      reference = setCommentToReference(reference, createComment({ id: 'comm-1' }))
      reference = setCommentToReference(reference, createComment({ id: 'comm-2' }))
      reference = setCommentToReference(reference, createComment({ id: 'comm-3' }))

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

    test('Add a comment to a full state', () => {
      let state = getDefaultState('res-1')
      expect(
        setCommentToState(
          state,
          { id: 'ref-1' },
          createComment({
            id: 'comm-1',
            content: 'some comment'
          })
        )
      ).toEqual({
        id: 'res-1',
        references: {
          'ref-1': {
            comments: {
              'comm-1': {
                author: null,
                content: 'some comment',
                createdAt: null,
                id: 'comm-1',
                reference: { id: 'ref-1' }
              }
            },
            id: 'ref-1'
          }
        }
      })
    })

    test('remove a comment from a full state', () => {
      let state = getDefaultState('res-1')
      state = setReference(state, { id: 'ref-1' })
      state = setCommentToState(
        state,
        { id: 'ref-1' },
        createComment({
          id: 'comm-1',
          content: 'some comment'
        })
      )
      state = setCommentToState(
        state,
        { id: 'ref-1' },
        createComment({
          id: 'comm-2',
          content: 'some other comment'
        })
      )
      state = setCommentToState(
        state,
        { id: 'ref-1' },
        createComment({
          id: 'comm-3',
          content: 'a third comment'
        })
      )

      expect(removeCommentFromState(state, { id: 'ref-1' }, { id: 'comm-1' })).toEqual({
        id: 'res-1',
        references: {
          'ref-1': {
            id: 'ref-1',
            comments: {
              'comm-2': {
                id: 'comm-2',
                content: 'some other comment',
                reference: { id: 'ref-1' },
                author: null,
                createdAt: null
              },
              'comm-3': {
                id: 'comm-3',
                content: 'a third comment',
                reference: { id: 'ref-1' },
                author: null,
                createdAt: null
              }
            }
          }
        }
      })
    })
  })
})
