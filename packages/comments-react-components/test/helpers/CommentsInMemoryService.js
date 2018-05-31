export const CommentsInMemoryService = () => {
  let commentIdProg = 1

  let comments = []

  function getCommentId() {
    return commentIdProg++
  }

  const addComment = async (comment) => {
    const newComment = {
      id: getCommentId(),
      resource: comment.resource,
      reference: comment.reference,
      content: comment.content,
      author: 'someauthor'
    }
    comments.push(newComment)

    return newComment
  }

  const removeComment = async (commentId) => {
    comments = comments.filter(comment => comment.id !== commentId)
  }

  const getComments = async (resource) => comments.filter(comment => comment.resource === resource)

  return {
    addComment,
    removeComment,
    getComments
  }
}
