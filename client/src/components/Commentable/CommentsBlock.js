import React from 'react'
import warning from 'warning'
import { CommentableContext } from './Provider'

class CommentableCommentsBlockElement extends React.Component {
  componentDidMount() {
    warning(
      this.props.commentable !== 'commentable',
      'The CommentableCommentsBlock component should be inside a CommentableProvider'
    )
  }

  hasCommentable() {
    return this.props.commentable && this.props.commentable !== 'commentable'
  }

  render() {
    if (!this.hasCommentable()) {
      return false
    }
    const comments = this.props.commentable.getBlockComments(
      this.props.commentable.showCommentsForTextBlock
    )
    return (
      !!comments.length && (
        <div style={{ border: '1px solid red' }}>
          <h3>Comments:</h3>
          {comments.map(comment => (
            <div ref={comment.id}>
              <h4>by {comment.author}</h4>
              <p>{comment.text}</p>{' '}
            </div>
          ))}
        </div>
      )
    )
  }
}

export class CommentableCommentsBlock extends React.Component {
  render() {
    return (
      <CommentableContext.Consumer>
        {commentable => (
          <CommentableCommentsBlockElement
            {...this.props}
            commentable={commentable}
          >
            {this.props.children}
          </CommentableCommentsBlockElement>
        )}
      </CommentableContext.Consumer>
    )
  }
}
