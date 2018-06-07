import { getDefaultState, removeCommentFromState, setCommentToState } from './helpers'

export const STATE_FIELD_NAME = 'commentsState'

export class CommentsState {
  constructor({ service, getProviderState, onCommentsStateUpdate, resource, logger }) {
    this.resource = resource
    this.service = service
    this.getProviderState = getProviderState
    this.onCommentsStateUpdate = onCommentsStateUpdate
    this.logger = logger || console

    this.unsubscribeFromResourceChange = null
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
    const providerCommentsState = this.getProviderState()[STATE_FIELD_NAME]
    return providerCommentsState && providerCommentsState.id === this.resource ? providerCommentsState : this.defaultState
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
  async subscribe() {
    await this.refresh()
    // FIXME if the time between the refresh and the subscribe an event occurs, is lost.
    // (Eg. Fix adding a timestamp for the subscription and returns all the comments since the timestamp)
    await this.subscribeToResourceChange()
  }

  /**
   * @param {Resource} resource
   * @returns {Promise<void>}
   */
  async unsubscribe() {
    this.unsubscribeFromResourceChange && (await this.unsubscribeFromResourceChange())
  }

  /**
   *
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
  async subscribeToResourceChange() {
    if (!this.service.onResourceChange) return
    this.unsubscribeFromResourceChange = await this.service.onResourceChange(this.resource, event => {
      switch (event.action) {
        case 'add':
          this.updateState(setCommentToState(this.state, { id: event.comment.reference }, event.comment))
          break
        case 'delete':
          this.updateState(removeCommentFromState(this.state, { id: event.comment.reference }, event.comment))
          break
        default:
          this.logger.warn('Event note expected', event.action)
      }
    })
  }
}
