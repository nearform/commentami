export class Comment {
  constructor(id, reference, content, author) {
    this.id = id
    this.reference = reference
    this.content = content
    this.author = author
  }
}

const defaultState = { comments: [] }

export class CommentsState {
  constructor(service, setState) {
    this.service = service
    this.setState = setState
    this.localState = defaultState
  }

  get defaultState() {
    return defaultState
  }

  async refresh(resource) {
    const result = await this.service.getComments(resource)
    const newCommentList = []
    result.forEach(comment => newCommentList.push(new Comment(comment.id, comment.reference, comment.content, comment.author)))
    this.localState = Object.assign({}, this.localState, { comments: newCommentList })
    this.setState(this.localState)
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
