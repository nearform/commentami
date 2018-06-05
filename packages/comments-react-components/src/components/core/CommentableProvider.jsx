import React from 'react'
import { CommentsState } from '../../state/Comments'

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
     *  lastRefreshedResource: null|Resource,
     *  addComment: any,
     *  removeComment: any,
     *  toggleComments: any,
     * }}
     */
    this.state = {
      logger: this.logger,
      resource: this.currentResource,
      lastRefreshedResource: null,

      // Actions / Methods
      addComment: this.addComment.bind(this),
      removeComment: this.removeComment.bind(this)
    }
  }

  /**
   * Returns the current resource set in the props
   * @returns {Resource}
   */
  get currentResource() {
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
   * Add a comment to a reference
   * @param {Reference} reference
   * @param {string} content
   * @returns {Promise<void>}
   */
  async addComment(reference, content) {
    try {
      await this.commentsState.addComment({
        resource: this.currentResource,
        reference,
        content
      })
    } catch (e) {
      this.logger.error(e)
    }
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

  componentDidMount() {
    this.commentsState.subscribe(this.getCurrentResource())
    this.setState({ lastRefreshedResource: this.getCurrentResource() })
  }

  componentWillUnmount() {
    this.commentsState.unsubscribe(this.getCurrentResource())
  }

  componentDidUpdate() {
    if (this.getCurrentResource() !== this.state.lastRefreshedResource) {
      this.commentsState.unsubscribe(this.state.lastRefreshedResource)
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
      // this value can be replaced with a `this.lastRefreshedResource` assignement
      this.setState({ lastRefreshedResource: this.getCurrentResource() }) // eslint-disable-line
    }
  }

  render() {
    return <CommentableContext.Provider value={this.state} children={this.props.children} />
  }
}
