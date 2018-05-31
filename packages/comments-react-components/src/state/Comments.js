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

export const STATE_FIELD_NAME = 'commentsState'

export class CommentsState {
  constructor(service, getProviderState, onCommentsStateUpdate) {
    this.service = service
    this.getProviderState = getProviderState
    this.onCommentsStateUpdate = onCommentsStateUpdate
  }

  get state() {
    return this.getProviderState()[STATE_FIELD_NAME] || {}
  }

  get defaultState() {
    return defaultState
  }

  updateState(state) {
    const newState = Object.assign({}, this.state, state)
    this.onCommentsStateUpdate({ [STATE_FIELD_NAME]: newState })
  }

  async refresh(resource) {
    const result = await this.service.getComments(resource)
    const newCommentList = []
    result.forEach(comment => newCommentList.push(new Comment(comment)))

    this.updateState({ comments: newCommentList })
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
