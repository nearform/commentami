// https://www.brandeps.com/icon/C/Comment-01
import React from 'react'
import warning from 'warning'
import { CommentableContext } from './Provider'

export const CommentableTextBlockContext = React.createContext(
  'commentableTextBlock'
)

class CommentableTextBlockElement extends React.Component {
  constructor(props) {
    super(props)

    this.commentableId = this.props.commentableId

    this.handleDoubleClick = this.handleDoubleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleCommentIconClick = this.handleCommentIconClick.bind(this)
  }

  handleMouseEnter(e) {
    if (this.hasCommentable()) {
      this.props.commentable.textBlockMouseEnter(e, this.commentableId)
    }
  }

  handleMouseLeave(e) {
    if (this.hasCommentable()) {
      this.props.commentable.textBlockMouseLeave(e, this.commentableId)
    }
  }

  handleDoubleClick(e) {
    if (this.hasCommentable()) {
      this.props.commentable.textBlockDoubleClick(e, this.commentableId)
    }
  }

  handleCommentIconClick(e) {
    if (this.hasCommentable()) {
      this.props.commentable.commentIconClick(e, this.commentableId)
    }
  }

  hasCommentable() {
    return this.props.commentable && this.props.commentable !== 'commentable'
  }

  componentWillUnmount() {
    if (this.hasCommentable()) {
      this.props.commentable.removeTextBlock(this)
    }
  }

  componentDidMount() {
    warning(
      this.props.commentable !== 'commentable',
      'The CommentableTextBlock component should be inside a CommentableProvider'
    )

    if (this.hasCommentable()) {
      this.props.commentable.addTextBlock(this)
    }
  }

  showIconComment() {
    return (
      this.hasCommentable() &&
      !!this.props.commentable.getBlockComments(this.commentableId).length
    )
  }

  render() {
    if (!this.hasCommentable()) {
      return false
    }

    const isHighlight =
      this.props.commentable.showCommentsForTextBlock === this.commentableId

    return (
      <CommentableTextBlockContext.Provider
        value={{
          showIcon: this.showIconComment(),
          onClick: this.handleCommentIconClick
        }}
      >
        <div
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onDoubleClick={this.handleDoubleClick}
          style={{ backgroundColor: isHighlight ? '#e3ead4' : 'white' }}
        >
          {this.props.children}
        </div>
      </CommentableTextBlockContext.Provider>
    )
  }
}

export class CommentableTextBlock extends React.Component {
  render() {
    return (
      <CommentableContext.Consumer>
        {commentable => (
          <CommentableTextBlockElement
            {...this.props}
            commentable={commentable}
          >
            {this.props.children}
          </CommentableTextBlockElement>
        )}
      </CommentableContext.Consumer>
    )
  }
}
