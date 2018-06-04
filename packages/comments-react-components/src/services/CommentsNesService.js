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

export function CommentsNesService(baseUrl) {
  const addComment = async (resource, comment) => {
    const client = await getClient(baseUrl)

    const options = {
      method: 'POST',
      path: `/comments`,
      payload: {
        resource: resource,
        reference: comment.reference.id,
        content: comment.content,
        author: 'An author' // This value should be removed and get directly from the session in the server
      }
    }

    const response = await client.request(options)
    return response.payload
  }

  const removeComment = async (comment) => {
    const client = await getClient(baseUrl)

    const options = {
      method: 'DELETE',
      path: `/comments/${comment.id}`
    }

    await client.request(options)
  }

  const getComments = async (resource) => {
    const client = await getClient(baseUrl)
    const response = await client.request(`/comments?resource=${resource}`)
    const { payload } = response

    return payload.comments
  }

  const onResourceChange = async (resource, handler) => {
    const client = await getClient(baseUrl)

    return client.subscribe(`/resources/${resource}`, handler)
  }

  return {
    addComment,
    removeComment,
    getComments,
    onResourceChange
  }
}
