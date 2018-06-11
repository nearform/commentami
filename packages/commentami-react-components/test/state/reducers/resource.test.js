import {
  removeCommentFromResource,
  removeReference,
  setCommentToResource,
  setReference
} from '../../../src/state/reducers/resource'

import { getDefaultState } from '../../../src/state/helpers/getters'
import { createComment } from '../../../src/state/helpers/creators'

describe('state/reducers/Resource', () => {
  describe('References', () => {
    test('Add a reference to the state', () => {
      let state = getDefaultState('res-1')

      expect(setReference(state, { id: 10 })).toEqual({
        fetchError: null,
        id: 'res-1',
        initError: null,
        isFetching: false,
        isInit: false,
        isUpdating: false,
        references: { '10': { comments: {}, id: 10 } },
        updateError: null
      })
    })

    test('Remove a reference', () => {
      let state = getDefaultState('res-1')
      state = setReference(state, { id: 'ref-1' })
      state = setReference(state, { id: 'ref-2' })
      state = setReference(state, { id: 'ref-3' })

      expect(removeReference(state, { id: 'ref-1' })).toEqual({
        fetchError: null,
        id: 'res-1',
        initError: null,
        isFetching: false,
        isInit: false,
        isUpdating: false,
        references: { 'ref-2': { comments: {}, id: 'ref-2' }, 'ref-3': { comments: {}, id: 'ref-3' } },
        updateError: null
      })
    })
  })

  test('Add a comment to a full state', () => {
    let state = getDefaultState('res-1')
    expect(
      setCommentToResource(
        state,
        { id: 'ref-1' },
        createComment({
          id: 'comm-1',
          content: 'some comment'
        })
      )
    ).toEqual({
      fetchError: null,
      id: 'res-1',
      initError: null,
      isFetching: false,
      isInit: false,
      isUpdating: false,
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
      },
      updateError: null
    })
  })

  test('remove a comment from a full state', () => {
    let state = getDefaultState('res-1')
    state = setReference(state, { id: 'ref-1' })
    state = setCommentToResource(
      state,
      { id: 'ref-1' },
      createComment({
        id: 'comm-1',
        content: 'some comment'
      })
    )
    state = setCommentToResource(
      state,
      { id: 'ref-1' },
      createComment({
        id: 'comm-2',
        content: 'some other comment'
      })
    )
    state = setCommentToResource(
      state,
      { id: 'ref-1' },
      createComment({
        id: 'comm-3',
        content: 'a third comment'
      })
    )

    expect(removeCommentFromResource(state, { id: 'ref-1' }, { id: 'comm-1' })).toEqual({
      fetchError: null,
      id: 'res-1',
      initError: null,
      isFetching: false,
      isInit: false,
      isUpdating: false,
      references: {
        'ref-1': {
          comments: {
            'comm-2': {
              author: null,
              content: 'some other comment',
              createdAt: null,
              id: 'comm-2',
              reference: { id: 'ref-1' }
            },
            'comm-3': {
              author: null,
              content: 'a third comment',
              createdAt: null,
              id: 'comm-3',
              reference: { id: 'ref-1' }
            }
          },
          id: 'ref-1'
        }
      },
      updateError: null
    })
  })
})

describe.skip('state/helpers', () => {
  test('Init the state', () => {
    expect(getDefaultState('res-1')).toEqual({ id: 'res-1', references: {} })
  })
})
