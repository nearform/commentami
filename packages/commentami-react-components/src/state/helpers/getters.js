import { createComment, createReference } from './creators'

/**
 * Get the default state
 * @returns {State}
 */
export const getDefaultState = idResource => ({
  id: idResource,
  references: {},

  isInit: false,
  initError: null,

  isFetching: false,
  fetchError: null,

  isUpdating: false,
  updateError: null
})

/**
 *
 * @param {Reference} reference
 * @param {Comment} commentOptions The comment options object
 * @param {string} commentOptions.id The comment identifier
 * @returns {Comment}
 */
export const getComment = (reference, { id }) => reference.comments[id] || createComment({ id })

/**
 *
 * @param {State} state
 * @param {Reference} referenceOptions The reference options object
 * @param {string} referenceOptions.id The reference identifier
 * @returns {Reference}
 */
export const getReference = (state, reference) => {
  if (typeof reference === 'undefined' || reference === null) reference = ''

  const id = typeof reference === 'string' ? reference : reference.id
  return state.references[id] || createReference({ id })
}
