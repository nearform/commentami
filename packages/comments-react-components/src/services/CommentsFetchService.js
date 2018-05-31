export function CommentsFetchService(baseUrl) {
  const addComment = async (comment) => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resource: comment.resource,
        reference: comment.reference,
        content: comment.content,
        author: 'An author' // This value should be removed and get directly from the session in the server
      })
    }

    const response = await fetch(`${baseUrl}comments`, options)
    return response.json()
  }

  const removeComment = async (commentId) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    await fetch(`${baseUrl}comments/${commentId}`, options)
  }

  const getComments = async (url) => {
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    const response = await fetch(`${baseUrl}comments?resource=${url}`, options)
    return (await response.json()).comments
  }

  return {
    addComment,
    removeComment,
    getComments
  }
}
