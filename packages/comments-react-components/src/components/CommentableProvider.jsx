import React from 'react'

import { Comments } from '../state/Comments'
import { CommentableSidebar } from './CommentableSidebar'
import { CommentableEventsManagerWrapper } from './CommentableEventsManager'

// The context for the Provider
export const CommentableContext = React.createContext('commentable')

export class CommentableProvider extends React.Component {
  constructor(props) {
    super(props)
    this.logger = this.props.logger || console

    this.comments = new Comments(this.props.service)

    this.state = {
      logger: this.logger,
      toggledReference: null,

      // Return the list of commend for a specific reference
      getReferenceComments: this.comments.getReferenceComments.bind(this.comments),

      // Actions
      addComment: this.addComment.bind(this),
      toggleComments: this.toggleComments.bind(this),

      lastResourceRefreshed: null
    }
  }

  getCurrentResource() {
    return this.props.resource
  }

  async addComment(reference, content) {
    try {
      await this.comments.addComment({
        url: this.getCurrentResource(),
        reference,
        content
      })
      this.setState({})
    } catch (e) {
      this.logger.error(e)
    }
  }

  toggleComments(referenceId) {
    this.setState(() => ({ toggledReference: !referenceId || this.state.toggledReference === referenceId ? null : referenceId }))
  }

  async refreshCommentList() {
    try {
      await this.comments.refresh(this.getCurrentResource())
      this.setState({ lastResourceRefreshed: this.getCurrentResource() })
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
