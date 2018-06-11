import { setReference } from '../../../src/state/reducers/resource'
import { getReference, getDefaultState } from '../../../src/state/helpers/getters'

describe('state/helpers/getters', () => {
  describe('References', () => {
    test('Get a reference', () => {
      let state = getDefaultState('res-1')
      state = setReference(state, { id: 'ref-1' })
      state = setReference(state, { id: 'ref-2' })
      state = setReference(state, { id: 'ref-3' })

      expect(getReference(state, { id: 'ref-1' })).toEqual({ comments: {}, id: 'ref-1' })
      expect(getReference(state, 'ref-1')).toEqual({ comments: {}, id: 'ref-1' })
    })
  })
})
