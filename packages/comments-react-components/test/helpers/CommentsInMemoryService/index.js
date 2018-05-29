export const CommentsInMemoryService = () => {
  let commentIdProg = 1

  let comments = []

  function getCommentId() {
    return commentIdProg++
  }

  const addComment = async (url, reference, content) => {
    const newComment = { id: getCommentId(), url, reference, content, author: 'someauthor' }
    comments.push(newComment)

    return newComment
  }

  const getComments = async (url) => comments.filter(comment => comment.url === url)

  return {
    addComment,
    getComments
  }
}
