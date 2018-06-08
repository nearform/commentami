import { createComment } from './comment'

/**
 * The reference object
 * @typedef {Object} Reference
 * @property {string} id - The Reference identifier
 * @property {Object.<string, Comment>} comments - The comments related to the reference
 */

/**
 * Create a new Reference
 * @param {Reference|Object} referenceOptions The reference object
 * @param {string} referenceOptions.id The reference identifier
 * @returns {Reference}
 */
export const createReference = ({ id }) => ({ id, comments: {} })

/**
 *
 * @param {Reference} reference
 * @param {Comment} commentOptions The comment options object
 * @param {string} commentOptions.id The comment identifier
 * @returns {Comment}
 */
export const getComment = (reference, { id }) => reference.comments[id] || createComment({ id })

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
 * Set a comment in the current reference,
 * if the comment exists, it's updated in the fields specified by the `comment` param
 *
 * @param {Reference} reference
 * @param {Comment} comment
 * @returns {Reference}
 */
export const setComment = (reference, comment) =>
  Object.assign({}, reference, {
    comments: Object.assign({}, reference.comments, {
      [comment.id]: Object.assign(
        {},
        getComment(reference, { id: comment.id }),
        Object.assign({}, comment, { reference: { id: reference.id } })
      )
    })
  })
