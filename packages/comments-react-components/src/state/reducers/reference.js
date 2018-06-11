import { getComment } from '../helpers/getters'

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
