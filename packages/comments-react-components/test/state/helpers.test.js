import deepFreeze from 'deep-freeze'
import {
  getDefaultState,
  getReference,
  setCommentToReference,
  setReferenceToResource,
  getResource,
  setResource,
  createResource,
  createReference,
  createComment,
  removeResource,
  removeReference,
  removeComment,
  setCommentByPath,
  removeCommentByPath
} from '../../src/state/helpers'

describe('CommentsState Helpers', () => {
  test('Init the state', () => {
    expect(getDefaultState()).toEqual({ resources: {} })
  })

  describe('Resources', () => {
    test('Create a resource', () => {
      expect(createResource({ id: 10 })).toEqual({ id: 10, references: {} })
    })

    test('get a resource', () => {
      const state = getDefaultState()
      deepFreeze(state)

      expect(getResource(state, { id: 1 })).toEqual({ id: 1, references: {} })
    })

    test('Set a default resource', () => {
      const state = getDefaultState()
      deepFreeze(state)

      expect(setResource(state, { id: 1 })).toEqual({
        resources: { '1': { id: 1, references: {} } }
      })
    })

    test('set a non existent resource with additional data', () => {
      let state = getDefaultState()
      deepFreeze(state)

      expect(setResource(state, { id: 1, foo: 'bar' })).toEqual({
        resources: {
          '1': {
            id: 1,
            references: {},
            foo: 'bar'
          }
        }
      })
    })

    test('update a existent resource with additional data', () => {
      let state = getDefaultState()
      deepFreeze(state)

      state = setResource(state, { id: 1 })
      deepFreeze(state)

      expect(state).toEqual({ resources: { '1': { id: 1, references: {} } } })

      expect(setResource(state, { id: 1, foo: 'bar' })).toEqual({
        resources: {
          '1': {
            id: 1,
            references: {},
            foo: 'bar'
          }
        }
      })
    })

    test('Remove a resource', () => {
      let state = getDefaultState()
      deepFreeze(state)

      state = setResource(state, { id: 1 })
      state = setResource(state, { id: 2 })
      state = setResource(state, { id: 3 })
      deepFreeze(state)

      expect(removeResource(state, { id: 2 })).toEqual({
        resources: {
          '1': { id: 1, references: {} },
          '3': { id: 3, references: {} }
        }
      })
    })
  })

  describe('References', () => {
    test('Create a reference', () => {
      expect(createReference({ id: 20 })).toEqual({ id: 20, comments: {} })
    })

    test('Add a reference to a resource', () => {
      let state = getDefaultState()
      deepFreeze(state)

      state = setResource(state, { id: 1 })
      deepFreeze(state)

      const resource = getResource(state, { id: 1 })

      expect(setReferenceToResource(resource, { id: 10 })).toEqual({
        id: 1,
        references: { '10': { comments: {}, id: 10 } }
      })
    })

    test('Add a reference to a resource and return the full state', () => {
      let state = getDefaultState()
      deepFreeze(state)

      state = setResource(state, { id: 1 })
      deepFreeze(state)

      expect(setResource(state, setReferenceToResource(getResource(state, { id: 1 }), { id: 10 }))).toEqual({
        resources: { '1': { id: 1, references: { '10': { comments: {}, id: 10 } } } }
      })
    })

    test('Remove a reference', () => {
      let state = getDefaultState()
      deepFreeze(state)

      let reference = createResource({ id: 1 })
      reference = setReferenceToResource(reference, { id: 'a' })
      reference = setReferenceToResource(reference, { id: 'b' })
      reference = setReferenceToResource(reference, { id: 'c' })
      deepFreeze(reference)

      expect(removeReference(reference, { id: 'a' })).toEqual({
        id: 1,
        references: {
          b: { id: 'b', comments: {} },
          c: { id: 'c', comments: {} }
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
        resource: null,
        author: null,
        createdAt: null
      })

      expect(createComment({ content: 'some content', reference: 'ref-1', resource: 'res-2' })).toEqual({
        id: null,
        content: 'some content',
        reference: 'ref-1',
        resource: 'res-2',
        author: null,
        createdAt: null
      })
    })

    test('Add a comment to a reference', () => {
      const reference = createReference({ id: 10 })

      expect(setCommentToReference(reference, createComment({ id: 20 }))).toEqual({
        id: 10,
        comments: {
          '20': {
            id: 20,
            content: null,
            reference: null,
            resource: null,
            author: null,
            createdAt: null
          }
        }
      })
    })

    test('Remove a comment', () => {
      let reference = createReference({ id: 10 })

      reference = setCommentToReference(reference, createComment({ id: 'comm-1' }))
      reference = setCommentToReference(reference, createComment({ id: 'comm-2' }))
      reference = setCommentToReference(reference, createComment({ id: 'comm-3' }))

      expect(removeComment(reference, { id: 'comm-2' })).toEqual({
        id: 10,
        comments: {
          'comm-1': {
            content: null,
            id: 'comm-1',
            reference: null,
            resource: null,
            author: null,
            createdAt: null
          },
          'comm-3': {
            content: null,
            id: 'comm-3',
            reference: null,
            resource: null,
            author: null,
            createdAt: null
          }
        }
      })
    })

    test('Add a comment to a full state', () => {
      let state = getDefaultState()
      let resource = createResource({ id: 'res-1' })
      state = setResource(state, resource)
      let reference = setReferenceToResource(getResource(state, resource), { id: 'ref-1' })
      expect(
        setCommentByPath(
          state,
          { id: 'res-1' },
          { id: 'ref-1' },
          createComment({
            id: 'comm-1',
            content: 'some comment'
          })
        )
      ).toEqual({
        resources: {
          'res-1': {
            id: 'res-1',
            references: {
              'ref-1': {
                id: 'ref-1',
                comments: {
                  'comm-1': {
                    id: 'comm-1',
                    content: 'some comment',
                    reference: null,
                    resource: null,
                    author: null,
                    createdAt: null
                  }
                }
              }
            }
          }
        }
      })
    })

    test('remove a comment from a full state', () => {
      let state = getDefaultState()
      let resource = createResource({ id: 'res-1' })
      state = setResource(state, resource)
      let reference = setReferenceToResource(getResource(state, resource), { id: 'ref-1' })
      state = setCommentByPath(
        state,
        { id: 'res-1' },
        { id: 'ref-1' },
        createComment({
          id: 'comm-1',
          content: 'some comment'
        })
      )
      state = setCommentByPath(
        state,
        { id: 'res-1' },
        { id: 'ref-1' },
        createComment({
          id: 'comm-2',
          content: 'some other comment'
        })
      )
      state = setCommentByPath(
        state,
        { id: 'res-1' },
        { id: 'ref-1' },
        createComment({
          id: 'comm-3',
          content: 'a third comment'
        })
      )

      expect(removeCommentByPath(state, { id: 'res-1' }, { id: 'ref-1' }, { id: 'comm-1' })).toEqual({
        resources: {
          'res-1': {
            id: 'res-1',
            references: {
              'ref-1': {
                id: 'ref-1',
                comments: {
                  'comm-2': {
                    id: 'comm-2',
                    content: 'some other comment',
                    reference: null,
                    resource: null,
                    author: null,
                    createdAt: null
                  },
                  'comm-3': {
                    id: 'comm-3',
                    content: 'a third comment',
                    reference: null,
                    resource: null,
                    author: null,
                    createdAt: null
                  }
                }
              }
            }
          }
        }
      })
    })
  })
})
