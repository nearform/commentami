import Comment from './Comment'

class Comments {
  constructor() {
    this.comments = []
  }

  addComment(comment) {
    this.comments.push(comment)
  }

  getBlockComments(idBlock) {
    return this.comments.filter(comment => comment.reference.block === idBlock)
  }

  init() {
    this.addComment(
      new Comment(1, { block: 'comm-1' }, 'This is a sample comment', 'Davide')
    )
    this.addComment(
      new Comment(2, { block: 'comm-3' }, 'This is another comment', 'Davide')
    )
  }
}

export default Comments
