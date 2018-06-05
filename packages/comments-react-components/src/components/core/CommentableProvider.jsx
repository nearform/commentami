import React from 'react'
import { CommentsState } from '../../state/Comments'

// The context for the Provider
export const CommentableContext = React.createContext('commentable')

export class CommentableProvider extends React.Component {
  constructor(props) {
    super(props)
    this.logger = this.props.logger || console

    this.commentsState = new CommentsState(this.props.service, this.getProviderState.bind(this), this.onCommentsStateUpdate.bind(this))

    this.state = {
      logger: this.logger,
      resource: this.currentResource,
      lastRefreshedResource: null,

      // Actions / Methods
      addComment: this.addComment.bind(this),
      removeComment: this.removeComment.bind(this)
    }
  }

  get currentResource() {
    return this.props.resource
  }

  getProviderState() {
    return this.state
  }

  onCommentsStateUpdate(newState) {
    return this.setState(newState)
  }

  async refreshCommentList() {
    try {
      this.setState(() => ({ lastRefreshedResource: this.currentResource }))
      await this.commentsState.refresh(this.currentResource)
    } catch (e) {
      this.logger.error(e)
    }
  }

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

  async removeComment(comment) {
    try {
      await this.commentsState.removeComment(comment)
    } catch (e) {
      this.logger.error(e)
    }
  }

  componentDidMount() {
    this.refreshCommentList()
  }

  componentDidUpdate() {
    if (this.currentResource !== this.state.lastRefreshedResource) {
      this.refreshCommentList()
    }
  }

  render() {
    return <CommentableContext.Provider value={this.state} children={this.props.children} />
  }
}
