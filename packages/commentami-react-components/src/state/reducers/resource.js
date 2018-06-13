import { removeComment, setComment } from './reference'
import { getReference } from '../helpers/getters'

/**
 * @param {State} state
 * @param {Reference} referenceOptions The reference object
 * @param {string} referenceOptions.id The reference identifier
 * @returns {State}
 */
export const removeReference = (state, { id }) =>
  Object.assign({}, state, {
    references: Object.entries(state.references)
      .filter(([key]) => {
        return key !== String(id)
      })
      .reduce((accumulator, [key, data]) => {
        accumulator[key] = data
        return accumulator
      }, {})
  })

/**
 * Set a reference in the current state,
 * if the reference exists, it's updated in the fields specified by the `reference` param
 *
 * @param {State} state
 * @param {Reference} reference
 * @returns {State}
 */
export const setReference = (state, reference) =>
  Object.assign({}, state, {
    references: Object.assign({}, state.references, {
      [reference.id]: Object.assign({}, getReference(state, { id: reference.id }), reference)
    })
  })

/**
 * Set a comment in the state, specifying the reference
 *
 * @param {State} state
 * @param {Reference} reference
 * @param {Comment} comment
 * @returns {State}
 */
export const setCommentToResource = (state, reference, comment) => {
  const localReference = getReference(state, reference)

  return setReference(state, setComment(localReference, comment))
}

/**
 * Remove a comment from the state, specifying the reference
 *
 * @param {State} state
 * @param {Reference} reference
 * @param {Comment} comment
 * @returns {State}
 */
export const removeCommentFromResource = (state, reference, comment) => {
  const localReference = getReference(state, reference)
  return setReference(state, removeComment(localReference, comment))
}
