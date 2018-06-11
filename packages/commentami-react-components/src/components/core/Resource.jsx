import React from 'react'
import PropTypes from 'prop-types'

import { CommentsState } from '../../state/Comments'
import { createComment } from '../../state/helpers/creators'

// The context for the Provider
export const ResourceContext = React.createContext('commentable')

export class Resource extends React.Component {
  constructor(props) {
    super(props)
    this.logger = this.props.logger

    this.commentsState = new CommentsState({
      service: this.props.service,
      getProviderState: this.getProviderState.bind(this),
      onCommentsStateUpdate: this.onCommentsStateUpdate.bind(this),
      resource: this.currentResource,
      logger: this.logger
    })

    /**
     *
     * @type {{
     *  logger: *|Console,
     *  toggledReference: null|Reference,
     *  lastRefreshedResource: null|string,
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
   * @returns {string}
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
      const comment = createComment({ reference, content })

      await this.commentsState.addComment({
        resource: this.currentResource,
        reference: comment.reference,
        content: comment.content
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
    this.commentsState.subscribe()
    this.setState({ lastRefreshedResource: this.currentResource })
  }

  componentWillUnmount() {
    this.commentsState.unsubscribe()
  }

  componentDidUpdate() {
    if (this.currentResource !== this.state.lastRefreshedResource) {
      this.commentsState.unsubscribe()
      this.commentsState = new CommentsState({
        service: this.props.service,
        getProviderState: this.getProviderState.bind(this),
        onCommentsStateUpdate: this.onCommentsStateUpdate.bind(this),
        resource: this.currentResource,
        logger: this.logger
      })
      this.commentsState.subscribe()

      // FIXME setState should not called in componentDidUpdate, this value can be set directly in the compoent instance
      // but is used in Sidebar and Block that can take the value from the CommentsState. Once refactored that part
      // this value can be replaced with a `this.lastRefreshedResource` assignement
      this.setState({ lastRefreshedResource: this.currentResource }) // eslint-disable-line
    }
  }

  render() {
    return <ResourceContext.Provider value={this.state} children={this.props.children} />
  }
}

Resource.displayName = 'Resource'

Resource.defaultProps = {
  logger: console
}

Resource.propTypes = {
  resource: PropTypes.string.isRequired,

  service: PropTypes.shape({
    addComment: PropTypes.func.isRequired,
    removeComment: PropTypes.func.isRequired,
    getComments: PropTypes.func.isRequired,
    onResourceChange: PropTypes.func
  }).isRequired,

  logger: PropTypes.shape({
    error: PropTypes.func.isRequired,
    debug: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    warn: PropTypes.func.isRequired
  }),

  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}
