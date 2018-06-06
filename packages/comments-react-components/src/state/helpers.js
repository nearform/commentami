/**
 * The state object
 * @typedef {Object} Resource
 * @property {string} id - The resource identifier
 * @property {Object.<string, Reference>} references - The references stored in the resource
 */

/**
 * The reference object
 * @typedef {Object} Reference
 * @property {string} id - The Reference identifier
 * @property {Object.<string, Comment>} comments - The comments related to the reference
 */

/**
 * The comment object
 * @typedef {Object} Comment
 * @property {string} id - The Comment identifier
 * @property {?Reference} reference
 * @property {?string} content
 * @property {?string} author
 * @property {?Timestamp} createdAt
 */

/**
 * A timestamp.
 * @typedef {(number)} Timestamp
 */

/**
 * Generate the default state
 * @returns {Resource}
 */
export const getDefaultState = idResource => ({ id: idResource, references: {} })

/**
 * Create a new Reference
 * @param {Reference|Object} referenceOptions The reference object
 * @param {string} referenceOptions.id The reference identifier
 * @returns {Reference}
 */
export const createReference = ({ id }) => ({ id, comments: {} })

/**
 * Create a new comment
 * @param {Comment|Object} commentOptions - The options required to generate the comment
 * @param {?string} commentOptions.id          The comment identifier
 * @param {?Reference} commentOptions.reference   The reference identifier
 * @param {?string} commentOptions.content     The content of the comment
 * @param {?string} commentOptions.author      The author of the comment
 * @param {?Timestamp} createdAt      The author of the comment
 *
 * @returns {Comment}
 */
export const createComment = ({ id = null, reference = null, content = null, author = null, createdAt = null }) => ({
  id,
  reference,
  content,
  author,
  createdAt
})

/**
 *
 * @param {Resource} state
 * @param {Reference} referenceOptions The reference options object
 * @param {string} referenceOptions.id The reference identifier
 * @returns {Reference}
 */
export const getReference = (state, { id }) => state.references[id] || createReference({ id })

/**
 *
 * @param {Reference} reference
 * @param {Comment} commentOptions The comment options object
 * @param {string} commentOptions.id The comment identifier
 * @returns {Comment}
 */
export const getComment = (reference, { id }) => reference.comments[id] || createComment({ id })

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
 * @param {Reference} reference
 * @param {Comment} commentOptions The comment object
 * @param {string} commentOptions.id The comment identifier
 * @returns {Reference}
 */
export const removeComment = (reference, { id }) =>
  Object.assign({}, reference, {
    comments: Object.entries(reference.comments)
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
 * Set a comment in the current reference,
 * if the comment exists, it's updated in the fields specified by the `comment` param
 *
 * @param {Reference} reference
 * @param {Comment} comment
 * @returns {Reference}
 */
export const setCommentToReference = (reference, comment) =>
  Object.assign({}, reference, {
    comments: Object.assign({}, reference.comments, {
      [comment.id]: Object.assign({}, getComment(reference, { id: comment.id }), Object.assign({}, comment, { reference: { id: reference.id } }))
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
export const setCommentToState = (state, reference, comment) => {
  const localReference = getReference(state, reference)
  return setReference(state, setCommentToReference(localReference, comment))
}

/**
 * Remove a comment from the state, specifying the reference
 *
 * @param {Resource} state
 * @param {Reference} reference
 * @param {Comment} comment
 * @returns {Resource}
 */
export const removeCommentFromState = (state, reference, comment) => {
  const localReference = getReference(state, reference)
  return setReference(state, removeComment(localReference, comment))
}
