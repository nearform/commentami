import { isInit, isFetching, isUpdating } from './selectors'
import { CommentsStateError, UPDATE_IN_PROGRESS_ERROR } from './errors'
import {
  getDefaultState,
  initialize,
  initializeFail,
  initializeSuccess,
  updatingSuccess,
  updatingFail,
  updating,
  fetchingSuccess,
  fetchingFail,
  fetching
} from './reducers'
import { removeCommentFromResource, setCommentToResource } from './reducers/resource'

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
    return providerCommentsState && providerCommentsState.id === this.resource
      ? providerCommentsState
      : this.defaultState
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
   * @returns {Promise<void>}
   */
  async subscribe() {
    this.updateState(initialize(this.state))
    try {
      await this.refresh(true)
      // FIXME if the time between the refresh and the subscribe an event occurs, is lost.
      // (Eg. Fix adding a timestamp for the subscription and returns all the comments since the timestamp)
      await this.subscribeToResourceChange()
      this.updateState(initializeSuccess(this.state))
    } catch (e) {
      this.updateState(initializeFail(this.state, e))
    }
  }

  /**
   * @returns {Promise<void>}
   */
  async unsubscribe() {
    this.unsubscribeFromResourceChange && (await this.unsubscribeFromResourceChange())
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async refresh(isSubscribing) {
    this.updateState(fetching(this.state))
    try {
      const result = await this.service.getComments(this.resource)
      let state = this.state
      result.forEach(comment => {
        // FIXME The service returns the reference as a string, the structure requires an object in the format {id: ...}
        state = setCommentToResource(state, { id: comment.reference }, comment)
      })

      this.updateState(fetchingSuccess(state))
    } catch (e) {
      this.updateState(fetchingFail(this.state, e))
      if (isSubscribing) throw e
    }
  }

  /**
   *
   * @param {Comment} comment
   * @returns {Promise<*|void>}
   */
  async addComment(comment) {
    if (this.state.isUpdating)
      throw new CommentsStateError('Tried to add a comment while the state is still updating', UPDATE_IN_PROGRESS_ERROR)

    this.updateState(updating(this.state))
    try {
      const result = await this.service.addComment(this.resource, comment)

      const state = setCommentToResource(this.state, comment.reference, result)
      this.updateState(updatingSuccess(state))
      return result
    } catch (e) {
      this.updateState(updatingFail(this.state, e))
    }
  }

  /**
   *
   * @param {Comment} comment
   * @returns {Promise<void>}
   */
  async removeComment(comment) {
    if (this.state.isUpdating)
      throw new CommentsStateError(
        'Tried to remove a comment while the state is still updating',
        UPDATE_IN_PROGRESS_ERROR
      )

    this.updateState(updating(this.state))
    try {
      await this.service.removeComment(comment)
      const state = removeCommentFromResource(this.state, comment.reference, comment)
      this.updateState(updatingSuccess(state))
    } catch (e) {
      this.updateState(updatingFail(this.state, e))
    }
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
          this.updateState(setCommentToResource(this.state, { id: event.comment.reference }, event.comment))
          break
        case 'delete':
          this.updateState(removeCommentFromResource(this.state, { id: event.comment.reference }, event.comment))
          break
        default:
          this.logger.warn('Event note expected', event.action)
      }
    })
  }
}
