import { Client as NesClient } from 'nes'

export function buildWebsocketClient(baseUrl, options) {
  return new NesClient(baseUrl, options)
}

/**
 * Socket event callback
 *
 * @callback socketEventCallback
 * @param {Object} event
 */

/**
 *
 * @param baseUrl
 * @returns {{
 *      addComment: function(*=, *): *,
 *      removeComment: removeComment,
 *      getComments: function(*): *,
 *      onResourceChange: function(*, *=): *
 *    }}
 * @constructor
 */
export function WebsocketService(client) {
  /**
   * Add a comment
   * @param {String} resource
   * @param {Comment} comment
   * @returns {Promise<Comment>}
   */
  const addComment = async (resource, comment) => {
    const options = {
      method: 'POST',
      path: `/comments`,
      payload: {
        resource: resource,
        reference: comment.reference.id,
        content: comment.content
      }
    }

    const response = await client.request(options)
    return response.payload
  }

  /**
   * Remove a comment
   * @param {Comment} comment
   * @returns {Promise<void>}
   */
  const removeComment = async comment => {
    const options = {
      method: 'DELETE',
      path: `/comments/${comment.id}`
    }

    await client.request(options)
  }

  /**
   * Get the comment list
   * @param {String} resource
   * @returns {Promise<Comments[]>}
   */
  const getComments = async resource => {
    const response = await client.request(`/comments?resource=${resource}`)
    const { payload } = response

    // TODO The pagination is not supported yet, the service loads the first 100 comments related to this resource.
    return payload.comments
  }

  /**
   *
   * @param resource
   * @param {socketEventCallback} handler
   * @returns {Promise<*>}
   */
  const onResourceChange = async (resource, handler) => {
    await client.subscribe(`/resources/${resource}`, handler)

    return () => client.unsubscribe(`/resources/${resource}`, handler)
  }

  return {
    addComment,
    removeComment,
    getComments,
    onResourceChange
  }
}
