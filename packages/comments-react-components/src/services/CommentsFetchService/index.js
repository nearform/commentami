export function CommentsFetchService(baseUrl) {
  const addComment = async (url, reference, content) => {
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        reference,
        content,
        author: 'An author' // This value should be removed and get directly from the session in the server
      })
    }

    const response = await fetch(`${baseUrl}comments`, options)
    return response.json()
  }

  const getComments = async (url) => {
    const options = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    const response = await fetch(`${baseUrl}comments?url=${url}`, options)
    return (await response.json()).comments
  }

  return {
    addComment,
    getComments
  }
}
