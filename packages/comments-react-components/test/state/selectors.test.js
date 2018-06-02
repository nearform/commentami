import { STATE_FIELD_NAME } from '../../src/state/Comments'
import {
  getDefaultState,
  setCommentByPath
} from '../../src/state/helpers'

import { resourcesCount, referencesCount, commentsCount } from '../../src/state/selectors'

describe('CommentsState Helpers', () => {
  describe('An empty state', () => {
    let state

    beforeEach(() => {
      state = getDefaultState()

      state = { [STATE_FIELD_NAME]: state }
    })
    test('The resource should be 0', () => {
      expect(resourcesCount(state)).toBe(0)
    })

    test('The reference of a non existent resource should be 0', () => {
      expect(referencesCount(state, { resource: {id: 'res-1'} })).toBe(0)
    })

    test('The comments of a non existent resource should be 0', () => {
      expect(commentsCount(state, { resource: {id: 'res-1'}, reference: {id: 'ref-1'} })).toBe(0)
    })
  })

  describe('With one comment', () => {
    let state

    beforeEach(() => {
      state = getDefaultState()
      state = setCommentByPath(state, { id: 'res-1' }, { id: 'ref-1' }, { id: 'comm-1' })

      state = { [STATE_FIELD_NAME]: state }
    })
    test('The resource should be 0', () => {
      expect(resourcesCount(state)).toBe(1)
    })

    test('The reference of a non existent resource should be 0', () => {
      expect(referencesCount(state, { resource: {id: 'res-1'} })).toBe(1)
    })

    test('The comments of a non existent resource should be 0', () => {
      expect(commentsCount(state, { resource: {id: 'res-1'}, reference: {id: 'ref-1'} })).toBe(1)
    })
  })
})
