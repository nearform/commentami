import { STATE_FIELD_NAME } from './Comments'
import { getDefaultState, getReference } from './helpers'

/**
 * Extract the CommentsState from the generic state
 * @param {Object}
 * @returns {State}
 * @private
 */
const _ = state => {
  return state[STATE_FIELD_NAME] || getDefaultState()
}

/**
 *
 * @param {Resource} state
 * @param {Reference} reference
 * @returns {Comment[]}
 */
export const selectCommentsByReference = (state, reference) => Object.values(getReference(_(state), reference).comments)

/**
 * Returns the number of reference for a specified resource
 *
 * @param {Resource} state The current state
 * @returns {number} The number of references
 */
export const referencesCount = state => Object.keys(_(state).references).length

/**
 *
 * Counts the comments in a specific reference
 *
 * @param {Resource} state
 * @param {Reference} reference The reference object
 * @returns {number} The number of comments
 */
export const commentsCount = (state, reference) => Object.keys(getReference(_(state), reference).comments).length
