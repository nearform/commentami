import { getDefaultState, setCommentToState, removeCommentFromState } from './helpers'

export const STATE_FIELD_NAME = 'commentsState'

export class CommentsState {
  constructor(service, getProviderState, onCommentsStateUpdate, resource) {
    this.resource = resource
    this.service = service
    this.getProviderState = getProviderState
    this.onCommentsStateUpdate = onCommentsStateUpdate

    this.subscribeToResourceChange()
  }

  /**
   * the default state of the CommentsState
   * @returns {State}
   */
  get defaultState() {
    return getDefaultState(this.resource)
  }

  /**
   * @returns {State}
   */
  get state() {
    return this.getProviderState()[STATE_FIELD_NAME] || this.defaultState
  }

  /**
   * Update the state in the provider
   * @param {State} state
   */
  updateState(state) {
    const newState = Object.assign({}, this.state, state)
    this.onCommentsStateUpdate({ [STATE_FIELD_NAME]: newState })
  }

  /**
   * @param {Resource} resource
   * @returns {Promise<void>}
   */
  async subscribe(resource) {
    this.refresh(resource)
  }

  /**
   * @param {Resource} resource
   * @returns {Promise<void>}
   */
  async unsubscribe(resource) {
    // console.log('unsubscribe', reference)
  }

  /**
   *
   * @param {Resource} resource
   * @returns {Promise<void>}
   */
  async refresh() {
    const result = await this.service.getComments(this.resource)

    let state = this.state
    result.forEach(comment => {
      // FIXME The service returns the reference as a string, the structure requires an object in the format {id: ...}
      state = setCommentToState(state, { id: comment.reference }, comment)
    })

    this.updateState(state)
  }

  /**
   *
   * @param {Comment} comment
   * @returns {Promise<void>}
   */
  async removeComment(comment) {
    await this.service.removeComment(comment)
    this.updateState(removeCommentFromState(this.state, comment.reference, comment))
  }

  /**
   *
   * @param {Comment} comment
   * @returns {Promise<*|void>}
   */
  async addComment(comment) {
    const result = await this.service.addComment(this.resource, comment)

    this.updateState(setCommentToState(this.state, comment.reference, result))
    return result
  }

  /**
   *
   * @param {Comment} comment
   * @returns {Promise<*|void>}
   */
  async subscribeToResourceChange() {
    if (!this.service.onResourceChange) return
    await this.service.onResourceChange(this.resource, event => {
      switch (event.action) {
        case 'add':
          this.updateState(setCommentToState(this.state, { id: event.comment.reference }, event.comment))
          break
        case 'delete':
          this.updateState(removeCommentFromState(this.state, { id: event.comment.reference }, event.comment))
          break
        default:
          console.warn('Event note expected', event.action)
      }
    })
  }
}
