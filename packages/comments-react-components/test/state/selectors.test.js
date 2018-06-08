import { CommentsState, STATE_FIELD_NAME } from '../../src/state/Comments'
import { getDefaultState, setCommentToState, createComment } from '../../src/state/helpers'

import { referencesCount, commentsCount, selectCommentsByReference } from '../../src/state/selectors'
import { CommentsInMemoryService } from '../helpers/CommentsInMemoryService'

describe('state/selectors', () => {
  describe('With no state', () => {
    let state

    beforeEach(() => {
      state = null
    })

    test('Should not crash', () => {
      expect(referencesCount(state)).toBe(0)
    })
  })

  describe('With no state STATE_FIELD_NAME state', () => {
    let state

    beforeEach(() => {
      state = { [STATE_FIELD_NAME]: null }
    })

    test('Should not crash', () => {
      expect(referencesCount(state)).toBe(0)
    })
  })

  describe('With an empty state', () => {
    let state

    beforeEach(() => {
      state = getDefaultState('res-1')
      state = { [STATE_FIELD_NAME]: state }
    })

    test('The reference should be 0', () => {
      expect(referencesCount(state)).toBe(0)
    })

    test('The comments of a non existent resource should be 0', () => {
      expect(commentsCount(state, { id: 'ref-1' })).toBe(0)
    })
  })

  describe('With one comment', () => {
    let state

    beforeEach(() => {
      state = getDefaultState()
      state = setCommentToState(state, { id: 'ref-1' }, { id: 'comm-1' })

      state = { [STATE_FIELD_NAME]: state }
    })
    test('The reference count should be 1', () => {
      expect(referencesCount(state, { id: 'res-1' })).toBe(1)
    })

    test('The comments ount should be 1', () => {
      expect(commentsCount(state, { id: 'ref-1' })).toBe(1)
    })
  })

  describe('selectCommentsByReference', () => {
    let state

    beforeEach(async () => {
      state = {
        commentsState: {
          id: 'res-1',
          references: {
            'ref-1': {
              id: 'ref-1',
              comments: {
                'comm-1': createComment({
                  id: 'comm-1',
                  author: 'Davide',
                  reference: 'ref-1',
                  createdAt: 400
                }),
                'comm-3': createComment({
                  id: 'comm-3',
                  author: 'Paolo',
                  reference: 'ref-1',
                  createdAt: 200
                }),
                'comm-2': createComment({
                  id: 'comm-2',
                  author: 'Filippo',
                  reference: 'ref-1',
                  createdAt: 300
                })
              }
            }
          }
        }
      }
    })

    test('with no sortBy and order defined should be ordered by createdAt ASC', () => {
      expect(selectCommentsByReference(state, { id: 'ref-1' })[0].id).toEqual('comm-3')
      expect(selectCommentsByReference(state, { id: 'ref-1' })[1].id).toEqual('comm-2')
      expect(selectCommentsByReference(state, { id: 'ref-1' })[2].id).toEqual('comm-1')
    })

    test('with no sortBy and order DESC defined should be ordered by createdAt DESC', () => {
      expect(selectCommentsByReference(state, { id: 'ref-1' }, undefined, -1)[0].id).toEqual('comm-1')
      expect(selectCommentsByReference(state, { id: 'ref-1' }, undefined, -1)[1].id).toEqual('comm-2')
      expect(selectCommentsByReference(state, { id: 'ref-1' }, undefined, -1)[2].id).toEqual('comm-3')
    })

    test('with sortBy id and no order defined should be ordered by id ASC', () => {
      expect(selectCommentsByReference(state, { id: 'ref-1' }, 'id')[0].id).toEqual('comm-1')
      expect(selectCommentsByReference(state, { id: 'ref-1' }, 'id')[1].id).toEqual('comm-2')
      expect(selectCommentsByReference(state, { id: 'ref-1' }, 'id')[2].id).toEqual('comm-3')
    })
  })
})
