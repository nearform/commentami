import { STATE_FIELD_NAME } from './Comments'
import { getDefaultState, getResource, getReference } from './helpers'

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
 * @param {State} state
 * @param {Object} options The options object
 * @param {Resource} options.resource
 * @param {Reference} options.reference
 * @param reference
 * @returns {Comment[]}
 */
export const selectCommentsByReference = (state, { resource = {}, reference = {} }) =>
  _(state).resources[resource.id] && (_(state).resources[resource.id]).references[reference.id]
    ? Object.values((_(state).resources[resource.id]).references[reference.id].comments)
    : []

/**
 * Returns the number of resources
 *
 * @param state
 * @returns {number} The number of recources
 */
export const resourcesCount = (state) => Object.keys(_(state).resources).length

/**
 * Returns the number of reference for a specified resource
 *
 * @param state
 * @param {Object} options The options object
 * @param {Resource} options.resource The resource identifier
 * @returns {number} The number of references
 */
export const referencesCount = (state, { resource = {} }) =>
  _(state).resources[resource.id]
    ? Object.keys((_(state).resources[resource.id]).references).length
    : 0

/**
 *
 * Counts the comments in a specific reference
 *
 * @param {State} state
 * @param {Object} options The options object
 * @param {Resource} options.resource The resource object
 * @param {Resource} options.reference The reference object
 * @returns {number} The number of comments
 */
export const commentsCount = (state, { resource = {}, reference = {} }) => {
  return getReference(getResource(_(state), resource), reference)
    ? Object.keys(((_(state).resources[resource.id]).references[reference.id]).comments).length
    : 0
}
