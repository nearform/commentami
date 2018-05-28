// A mock id generator
let commentIdProg = 10

function getCommentId() {
  return commentIdProg++
}

export const CommentsInMemoryService = () => {
  // Temporary storage
  let comments = []

  const addComment = async (url, reference, content) => {
    const newComment = { id: getCommentId(), url, reference, content, author: 'someauthor' }
    comments.push(newComment)

    return newComment
  }

  const getComments = async (url) => {
    return comments.filter(comment => comment.url === url)
  }

  return {
    addComment,
    getComments
  }
}
