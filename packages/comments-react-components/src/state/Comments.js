export class Comment {
  constructor(id, reference, content, author) {
    this.id = id
    this.reference = reference
    this.content = content
    this.author = author
  }
}

export class CommentsState {
  constructor(service, setState) {
    this.service = service
    this.setState = setState
    this.comments = []
  }

  get defaultState() {
    return this.comments
  }

  size() {
    return this.comments.length
  }

  async refresh(resource) {
    const result = await this.service.getComments(resource)
    this.comments = []
    result.forEach(comment => this.comments.push(new Comment(comment.id, comment.reference, comment.content, comment.author)))
    this.setState({ comments: this.comments })
  }

  async removeComment({ resource, commentId }) {
    await this.service.removeComment(commentId)

    // FIXME Refresh the list at every add, optimize this
    await this.refresh(resource)
  }

  async addComment({ resource, reference, content }) {
    const result = await this.service.addComment(resource, reference, content)

    // FIXME Refresh the list at every add, optimize this
    await this.refresh(resource)
    return result
  }
}
