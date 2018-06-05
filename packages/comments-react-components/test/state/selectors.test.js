import { STATE_FIELD_NAME } from '../../src/state/Comments'
import { getDefaultState, setCommentToState } from '../../src/state/helpers'

import { referencesCount, commentsCount } from '../../src/state/selectors'

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
})
