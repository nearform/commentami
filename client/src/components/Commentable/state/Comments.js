class Comments {
  constructor() {
    this.comments = []
  }

  size() {
    return this.comments.length
  }

  addComment(comment) {
    this.comments.push(comment)
  }

  getBlockComments(idBlock) {
    return this.comments.filter(comment => comment.reference.block === idBlock)
  }
}

export default Comments
