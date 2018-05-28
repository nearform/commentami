import React from 'react'

import { Comment, Comments } from '../state/Comments'
import { CommentableSidebar } from './CommentableSidebar'

// The context for the Provider
export const CommentableContext = React.createContext('commentable')

// A mock id generator
let commentIdProg = 10

function getCommentId() {
  return commentIdProg++
}

export class CommentableProvider extends React.Component {
  constructor(props) {
    super(props)
    this.commentsTextBlock = []
    this.logger = this.props.logger || console

    this.comments = new Comments()

    this.state = {
      logger: this.logger,
      toggledBlock: null,

      // Return the list of commend for a specific block
      getBlockComments: this.comments.getBlockComments.bind(this.comments),

      // Actions
      addComment: this.addComment.bind(this),
      toggleComments: this.toggleComments.bind(this)
    }
  }

  addComment(blockId, message) {
    this.comments.addComment(new Comment(getCommentId(), { block: blockId }, message, 'Davide'))

    // Required to propagate the update, search for a better solution
    this.setState({})
  }

  toggleComments(blockId) {
    this.setState(() => ({ toggledBlock: !blockId || this.state.toggledBlock === blockId ? null : blockId }))
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
