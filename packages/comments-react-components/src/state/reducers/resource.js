import { removeComment, setComment } from './reference'
import { getReference } from '../helpers/getters'

/**
 * @param {Resource} state
 * @param {Reference} referenceOptions The reference object
 * @param {string} referenceOptions.id The reference identifier
 * @returns {Resource}
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
 * @param {Resource} state
 * @param {Reference} reference
 * @returns {Resource}
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
 * @param {Resource} state
 * @param {Reference} reference
 * @param {Comment} comment
 * @returns {Resource}
 */
export const setCommentToResource = (state, reference, comment) => {
  const localReference = getReference(state, reference)
  return setReference(state, setComment(localReference, comment))
}

/**
 * Remove a comment from the state, specifying the reference
 *
 * @param {Resource} state
 * @param {Reference} reference
 * @param {Comment} comment
 * @returns {Resource}
 */
export const removeCommentFromResource = (state, reference, comment) => {
  const localReference = getReference(state, reference)
  return setReference(state, removeComment(localReference, comment))
}
