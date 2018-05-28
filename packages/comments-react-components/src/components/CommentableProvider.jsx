import React from 'react'

import { Comments } from '../state/Comments'
import { CommentableSidebar } from './CommentableSidebar'

// The context for the Provider
export const CommentableContext = React.createContext('commentable')

export class CommentableProvider extends React.Component {
  constructor(props) {
    super(props)
    this.commentsTextBlock = []
    this.logger = this.props.logger || console

    this.comments = new Comments(this.props.service)

    this.state = {
      logger: this.logger,
      toggledBlock: null,

      // Return the list of commend for a specific block
      getBlockComments: this.comments.getBlockComments.bind(this.comments),

      // Actions
      addComment: this.addComment.bind(this),
      toggleComments: this.toggleComments.bind(this),

      // TODO Rename this with a more suitable name
      // SectionId, CommentableSectionId
      lastSectionId: null
    }
  }

  getCurrentSectionId() {
    return this.props.sectionId
  }

  async addComment(reference, content) {
    try {
      await this.comments.addComment({
        url: this.getCurrentSectionId(),
        reference,
        content
      })
      this.setState({})
    } catch (e) {
      this.logger.error(e)
    }
  }

  toggleComments(blockId) {
    this.setState(() => ({ toggledBlock: !blockId || this.state.toggledBlock === blockId ? null : blockId }))
  }

  async refreshCommentList() {
    try {
      await this.comments.refresh(this.getCurrentSectionId())
      this.setState({ lastSectionId: this.getCurrentSectionId() })
    } catch (e) {
      this.logger.error(e)
    }
  }

  componentDidMount() {
    this.refreshCommentList()
  }

  componentDidUpdate() {
    if (this.getCurrentSectionId() !== this.state.lastSectionId) {
      this.refreshCommentList()
    }
  }

  render() {
    return (
      <CommentableContext.Provider value={this.state}>
        <CommentableSidebar className={this.props.sidebarClassName} commentComponent={this.props.commentComponent} />
        {this.props.children}
      </CommentableContext.Provider>
    )
  }
}
