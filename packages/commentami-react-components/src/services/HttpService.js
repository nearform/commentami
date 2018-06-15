export function HttpService(baseUrl, authorization) {
  const addComment = async (resource, comment) => {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      },
      body: JSON.stringify({
        resource: resource,
        reference: comment.reference.id,
        content: comment.content
      })
    }

    const response = await fetch(`${baseUrl}comments`, options)
    return response.json()
  }

  const removeComment = async comment => {
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    }

    await fetch(`${baseUrl}comments/${comment.id}`, options)
  }

  const getComments = async resource => {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization
      }
    }

    const response = await fetch(`${baseUrl}comments?resource=${resource}`, options)
    return (await response.json()).comments
  }

  return {
    addComment,
    removeComment,
    getComments
  }
}
