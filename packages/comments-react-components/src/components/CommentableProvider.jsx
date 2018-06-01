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

    this.commentsState = new CommentsState(this.props.service, this.getProviderState.bind(this), this.onCommentsStateUpdate.bind(this))

    this.state = {
      logger: this.logger,
      toggledReference: null,

      // Actions
      addComment: this.addComment.bind(this),
      removeComment: this.removeComment.bind(this),
      toggleComments: this.toggleComments.bind(this),

      lastResourceRefreshed: null
    }
  }

  getCurrentResource() {
    return this.props.resource
  }

  getProviderState() {
    return this.state
  }

  onCommentsStateUpdate(newState) {
    return this.setState(newState)
  }

  async removeComment(comment) {
    try {
      await this.commentsState.removeComment(comment)
    } catch (e) {
      this.logger.error(e)
    }
  }

  async addComment(reference, content) {
    try {
      await this.commentsState.addComment({
        resource: this.getCurrentResource(),
        reference,
        content
      })
    } catch (e) {
      this.logger.error(e)
    }
  }

  toggleComments(referenceId) {
    this.setState(() => ({ toggledReference: !referenceId || this.state.toggledReference === referenceId ? null : referenceId }))
  }

  async refreshCommentList() {
    try {
      this.setState({ lastResourceRefreshed: this.getCurrentResource() })
      await this.commentsState.refresh(this.getCurrentResource())
    } catch (e) {
      this.logger.error(e)
    }
  }

  componentDidMount() {
    this.refreshCommentList()
  }

  componentDidUpdate() {
    if (this.getCurrentResource() !== this.state.lastResourceRefreshed) {
      this.refreshCommentList()
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
