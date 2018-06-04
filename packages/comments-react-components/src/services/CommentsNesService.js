import { Client as NesClient } from 'nes'

const nesClients = {}

async function getClient(baseUrl) {
  if (!nesClients[baseUrl]) {
    let client = new NesClient(baseUrl)
    await client.connect()
    nesClients[baseUrl] = client
  }

  return nesClients[baseUrl]
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
 * @returns {{addComment: function(*=, *): *, removeComment: removeComment, getComments: function(*): *, onResourceChange: function(*, *=): *}}
 * @constructor
 */
export function CommentsNesService(baseUrl) {
  /**
   * Add a comment
   * @param {String} resource
   * @param {Comment} comment
   * @returns {Promise<Comment>}
   */
  const addComment = async (resource, comment) => {
    const client = await getClient(baseUrl)

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
    const client = await getClient(baseUrl)

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
    const client = await getClient(baseUrl)
    const response = await client.request(`/comments?resource=${resource}`)
    const { payload } = response

    // TODO The pagination is not currently supported, the service loads all the comments related to this resource.
    return payload.comments
  }

  /**
   *
   * @param resource
   * @param {socketEventCallback} handler
   * @returns {Promise<*>}
   */
  const onResourceChange = async (resource, handler) => {
    const client = await getClient(baseUrl)

    // TODO verify how and when unsubscribe
    return client.subscribe(`/resources/${resource}`, handler)
  }

  return {
    addComment,
    removeComment,
    getComments,
    onResourceChange
  }
}
