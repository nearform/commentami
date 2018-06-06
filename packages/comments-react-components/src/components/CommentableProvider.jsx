import React from 'react'

import { CommentsState } from '../state/Comments'
import { CommentableSidebar } from './CommentableSidebar'
import { CommentableEventsManagerWrapper } from './CommentableEventsManager'

// The context for the Provider
export const CommentableContext = React.createContext('commentable')

export class CommentableProvider extends React.Component {
  constructor(props) {
    super(props)
    this.logger = this.props.logger || console

    this.commentsState = new CommentsState({
      service: this.props.service,
      getProviderState: this.getProviderState.bind(this),
      onCommentsStateUpdate: this.onCommentsStateUpdate.bind(this),
      resource: this.getCurrentResource(),
      logger: this.logger
    })

    /**
     *
     * @type {{
     *  logger: *|Console,
     *  toggledReference: null|Reference,
     *  lastResourceRefreshed: null|Resource,
     *  addComment: any,
     *  removeComment: any,
     *  toggleComments: any,
     * }}
     */
    this.state = {
      logger: this.logger,
      toggledReference: null,
      lastResourceRefreshed: null,

      // Actions
      addComment: this.addComment.bind(this),
      removeComment: this.removeComment.bind(this),
      toggleComments: this.toggleComments.bind(this)
    }
  }

  /**
   * Returns the current resource set in the props
   * @returns {Resource}
   */
  getCurrentResource() {
    return this.props.resource
  }

  /**
   * Get the current state, used in the CommentsState to retrieve the state
   * @returns {Object}
   */
  getProviderState() {
    return this.state
  }

  /**
   * Update the state
   * @param {Object} newState
   * @returns {*}
   */
  onCommentsStateUpdate(newState) {
    return this.setState(newState)
  }

  /**
   * Remove a comment from the state
   * @param {Comment} comment
   * @returns {Promise<void>}
   */
  async removeComment(comment) {
    try {
      await this.commentsState.removeComment(comment)
    } catch (e) {
      this.logger.error(e)
    }
  }

  /**
   * Add a comment to a reference
   * @param {Reference} reference
   * @param {string} content
   * @returns {Promise<void>}
   */
  async addComment(reference, content) {
    try {
      await this.commentsState.addComment({
        reference,
        content
      })
    } catch (e) {
      this.logger.error(e)
    }
  }

  /**
   * Toggle the current comment
   * @param {Reference} referenceId
   */
  toggleComments(reference) {
    const referenceId = reference && reference.id
    const currentReferenceId = this.state.toggledReference && this.state.toggledReference.id
    this.setState(() => ({
      toggledReference: !referenceId || currentReferenceId === referenceId ? null : { id: referenceId }
    }))
  }

  componentDidMount() {
    this.commentsState.subscribe(this.getCurrentResource())
    this.setState({ lastResourceRefreshed: this.getCurrentResource() })
  }

  componentWillUnmount() {
    this.commentsState.unsubscribe(this.getCurrentResource())
  }

  componentDidUpdate() {
    if (this.getCurrentResource() !== this.state.lastResourceRefreshed) {
      this.commentsState.unsubscribe(this.state.lastResourceRefreshed)
      this.commentsState = new CommentsState({
        service: this.props.service,
        getProviderState: this.getProviderState.bind(this),
        onCommentsStateUpdate: this.onCommentsStateUpdate.bind(this),
        resource: this.getCurrentResource(),
        logger: this.logger
      })
      this.commentsState.subscribe(this.getCurrentResource())

      // FIXME setState should not called in componentDidUpdate, this value can be set directly in the compoent instance
      // but is used in Sidebar and Block that can take the value from the CommentsState. Once refactored that part
      // this value can be replaced with a `this.lastResourceRefreshed` assignement
      this.setState({ lastResourceRefreshed: this.getCurrentResource() }) // eslint-disable-line
    }
  }

  render() {
    return (
      <CommentableContext.Provider value={this.state}>
        <CommentableSidebar className={this.props.sidebarClassName} commentComponent={this.props.commentComponent} />
        <CommentableEventsManagerWrapper component={this.props.eventsManagerComponent} children={this.props.children} />
      </CommentableContext.Provider>
    )
  }
}
