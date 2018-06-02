/**
 * The state object.
 * @typedef {Object} State
 * @property {Object.<string, Resource>} resources - The resources managed by the state
 */

/**
 * The resource object
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
 * @property {?Resource} resource
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
 * @returns {State}
 */
export const getDefaultState = () => ({ resources: {} })

/**
 * Create a new Resource
 * @param {Resource|Object} resourceOptions The resource object
 * @param {string} resourceOptions.id The resource identifier
 * @returns {Resource}
 */
export const createResource = ({ id }) => ({ id, references: {} })

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
 * @param {?Resource} commentOptions.resource    The resource identifier
 * @param {?Reference} commentOptions.reference   The reference identifier
 * @param {?string} commentOptions.content     The content of the comment
 * @param {?string} commentOptions.author      The author of the comment
 * @param {?Timestamp} createdAt      The author of the comment
 *
 * @returns {Comment}
 */
export const createComment = ({ id = null, resource = null, reference = null, content = null, author = null, createdAt = null }) => ({
  id,
  resource,
  reference,
  content,
  author,
  createdAt
})

/**
 *
 * @param {State} state
 * @param {Resource} resourceOptions The resource object
 * @param {string} resourceOptions.id The resource identifier
 * @returns {Resource}
 */
export const getResource = (state, { id } = {}) =>
  state.resources[id] || createResource({ id })

/**
 *
 * @param {Resource} resource
 * @param {Reference} referenceOptions The reference options object
 * @param {string} referenceOptions.id The reference identifier
 * @returns {Reference}
 */
export const getReference = (resource, { id }) => resource.references[id] || createReference({ id })

/**
 *
 * @param {Reference} reference
 * @param {Comment} commentOptions The comment options object
 * @param {string} commentOptions.id The comment identifier
 * @returns {Comment}
 */
export const getComment = (reference, { id }) => reference.comments[id] || createComment({ id })

/**
 * @param {State} state
 * @param {Resource} resourceOptions The resource object
 * @param {string} resourceOptions.id The resource identifier
 * @returns {State}
 */
export const removeResource = (state, { id }) =>
  Object.assign({}, state, {
    resources: Object.entries(state.resources)
      .filter(([key]) => {
        return key !== String(id)
      })
      .reduce((accumulator, [key, data]) => {
        accumulator[key] = data
        return accumulator
      }, {})
  })

/**
 * @param {Resource} resource
 * @param {Reference} referenceOptions The reference object
 * @param {string} referenceOptions.id The reference identifier
 * @returns {Resource}
 */
export const removeReference = (resource, { id }) =>
  Object.assign({}, resource, {
    references: Object.entries(resource.references)
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
 * Set a resource in the current state,
 * if the resource exists, it's updated in the fields specified by the `resource` param
 *
 * @param {State} state
 * @param {Resource} resource
 * @returns {State}
 */
export const setResource = (state, resource) =>
  Object.assign({}, state, {
    resources: Object.assign({}, state.resources, {
      [resource.id]: Object.assign({}, getResource(state, { id: resource.id }), resource)
    })
  })

/**
 * Set a reference in the current resource,
 * if the reference exists, it's updated in the fields specified by the `reference` param
 *
 * @param {Resource} resource
 * @param {Reference} reference
 * @returns {Resource}
 */
export const setReferenceToResource = (resource, reference) =>
  Object.assign({}, resource, {
    references: Object.assign({}, resource.references, {
      [reference.id]: Object.assign({}, getReference(resource, { id: reference.id }), reference)
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
      [comment.id]: Object.assign({}, getComment(reference, { id: comment.id }), comment)
    })
  })

/**
 * Set a comment in the state, specifying the resource and reference
 *
 * @param {State} state
 * @param {Resource} resource
 * @param {Reference} reference
 * @param {Comment} comment
 * @returns {State}
 */
export const setCommentByPath = (state, resource, reference, comment) => {
  const localResource = getResource(state, resource)
  const localReference = getReference(localResource, reference)
  return setResource(state, setReferenceToResource(localResource, setCommentToReference(localReference, comment)))
}

/**
 * Remove a comment from the state, specifying the resource and reference
 *
 * @param {State} state
 * @param {Resource} resource
 * @param {Reference} reference
 * @param {Comment} comment
 * @returns {State}
 */
export const removeCommentByPath = (state, resource, reference, comment) => {
  const localResource = getResource(state, resource)
  const localReference = getReference(localResource, reference)
  return setResource(state, setReferenceToResource(localResource, removeComment(localReference, comment)))
}
