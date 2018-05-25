export class Comment {
  constructor(id, reference, content, author) {
    this.id = id
    this.reference = reference
    this.content = content
    this.author = author
  }
}

export class Comments {
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
