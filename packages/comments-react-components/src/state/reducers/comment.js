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
  reference: typeof reference === 'string' ? { id: reference } : reference,
  content,
  author,
  createdAt
})
