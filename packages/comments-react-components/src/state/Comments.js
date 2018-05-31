export class Comment {
  constructor(data) {
    this.id = data.id
    this.resource = data.resource
    this.reference = data.reference
    this.content = data.content
    this.author = data.author
  }
}

const defaultState = { comments: [] }

export class CommentsState {
  constructor(service, onCommentsStateUpdate) {
    this.service = service
    this.onCommentsStateUpdate = onCommentsStateUpdate
    this.localState = defaultState
  }

  get defaultState() {
    return defaultState
  }

  async refresh(resource) {
    const result = await this.service.getComments(resource)
    const newCommentList = []
    result.forEach(comment => newCommentList.push(new Comment(comment)))
    this.localState = Object.assign({}, this.localState, { comments: newCommentList })
    this.onCommentsStateUpdate(this.localState)
  }

  async removeComment(comment) {
    await this.service.removeComment(comment)

    // FIXME Refresh the list at every add, optimize this
    await this.refresh(comment.resource)
  }

  async addComment({ resource, reference, content }) {
    const result = await this.service.addComment(new Comment({ resource, reference, content }))

    // FIXME Refresh the list at every add, optimize this
    await this.refresh(resource)
    return result
  }
}
