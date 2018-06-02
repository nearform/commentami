import {
  getDefaultState,
  setCommentByPath,
  removeCommentByPath
} from './helpers'

export const STATE_FIELD_NAME = 'commentsState'

export class CommentsState {
  constructor(service, getProviderState, onCommentsStateUpdate) {
    this.service = service
    this.getProviderState = getProviderState
    this.onCommentsStateUpdate = onCommentsStateUpdate
  }

  /**
   * the default state of the CommentsState
   * @returns {State}
   */
  get defaultState() {
    return getDefaultState()
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
  async refresh(resource) {
    const result = await this.service.getComments(resource)

    let state = this.state
    result.forEach(comment => {
      state = setCommentByPath(state, { id: comment.resource }, { id: comment.reference }, comment)
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
    this.updateState(removeCommentByPath(this.state, comment.resource, comment.reference, comment))
  }

  /**
   *
   * @param {Comment} comment
   * @returns {Promise<*|void>}
   */
  async addComment(comment) {
    const result = await this.service.addComment(comment)

    this.updateState(setCommentByPath(this.state, comment.resource, comment.reference, result))
    return result
  }
}
