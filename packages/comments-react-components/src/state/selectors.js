import { STATE_FIELD_NAME } from './Comments'

import { getDefaultState } from './reducers'
import { getReference } from './reducers/resource'

/**
 * Extract the CommentsState from the generic state
 * @param {Object}
 * @returns {State}
 * @private
 */
const _ = state => {
  return (state && state[STATE_FIELD_NAME]) || getDefaultState()
}

/**
 *
 * @param {Resource} state
 * @param {Reference} reference
 * @param {string} [sortBy=createdAt]
 * @param {number} [order=1] A positive number sort ASC, a negative DESC
 *
 * @returns {Comment[]}
 */
export const selectCommentsByReference = (state, reference, sortBy = 'createdAt', order = 1) =>
  Object.values(getReference(_(state), reference).comments).sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return -order
    }
    if (a[sortBy] > b[sortBy]) {
      return order
    }
    return 0
  })

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

export const isUpdating = state => _(state).isUpdating

export const isFetching = state => _(state).isFetching

export const isInit = state => _(state).isInit
