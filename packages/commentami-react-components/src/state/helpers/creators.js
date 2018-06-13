/**
 * The comment object
 * @typedef {Object} Comment
 * @property {string} id - The Comment identifier
 * @property {?Reference} reference - The reference that contains the comment
 * @property {?string} content - The text of the comment
 * @property {?string} author - The author of the comment, this will became a more complex structure in the future implementation
 * @property {?Timestamp} createdAt - The timestamp of the comment
 */

/**
 * Create a new comment
 * @param {Comment|Object} commentOptions - The options required to generate the comment
 * @param {?string} commentOptions.id - The comment identifier
 * @param {?Reference} commentOptions.reference - The reference identifier
 * @param {?string} commentOptions.content - The content of the comment
 * @param {?string} commentOptions.author - The author of the comment
 * @param {?Timestamp} commentOptions.createdAt      The author of the comment
 *
 * @returns {Comment}
 */
export const createComment = ({ id = null, reference = null, content = null, author = null, createdAt = null }) => ({
  id,
  reference: typeof reference === 'string' ? { id: reference } : reference,
  content,
  author,
  createdAt
})

/**
 * The reference object
 * @typedef {Object} Reference
 * @property {string} id - The Reference identifier
 * @property {Object.<string, Comment>} comments - The comments related to the reference
 */

/**
 * Create a new Reference
 * @param {Reference} referenceOptions The reference object
 * @param {string} referenceOptions.id The reference identifier
 * @returns {Reference}
 */
export const createReference = ({ id }) => ({ id, comments: {} })
