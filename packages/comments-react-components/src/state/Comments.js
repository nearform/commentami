export class Comment {
  constructor(id, reference, content, author) {
    this.id = id
    this.reference = reference
    this.content = content
    this.author = author
  }
}

export class Comments {
  constructor(service) {
    this.service = service
    this.comments = []
  }

  size() {
    return this.comments.length
  }

  async refresh(resource) {
    const result = await this.service.getComments(resource)
    this.comments = []
    result.forEach(comment => this.comments.push(new Comment(comment.id, comment.reference, comment.content, comment.author)))
  }

  async addComment({ resource, reference, content }) {
    const result = await this.service.addComment(resource, reference, content)

    // FIXME Refresh the list at every add, optimize this
    await this.refresh(resource)
    return result
  }

  // FIXME Currently uses the local list, further improvement allow to refresh the list from the server
  getBlockComments(referenceId) {
    return this.comments.filter(comment => comment.reference === referenceId)
  }
}
