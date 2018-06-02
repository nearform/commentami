import React from 'react'
import { createPortal } from 'react-dom'

import { selectCommentsByReference } from '../state/selectors'
import { CommentableContext } from './CommentableProvider'
import { CommentableIcon } from './CommentableIcon'

class DefaultCommentComponent extends React.Component {
  constructor(props) {
    super(props)
    this.boundHandleRemove = this.handleRemove.bind(this)
  }

  handleRemove() {
    this.props.onRemoveComment && this.props.onRemoveComment(this.props.comment)
  }

  render() {
    return (
      <div>
        <h4>{this.props.comment.author} said:</h4>
        <p>{this.props.comment.content}</p>
        <button onClick={this.boundHandleRemove}>Remove</button>
      </div>
    )
  }
}

export class CommentableSidebarComponent extends React.Component {
  constructor(props) {
    super(props)

    this.textareaRef = React.createRef()

    this.boundHandleAddComment = this.handleAddComment.bind(this)
    this.boundHandleRemoveComment = this.handleRemoveComment.bind(this)
    this.boundHandleClearComment = this.handleClearComment.bind(this)
    this.boundHandleKeyPress = this.handleKeyPress.bind(this)
    this.boundHandleHideComments = this.handleHideComments.bind(this)
  }

  handleAddComment() {
    const value = (this.textareaRef.current.value || '').trim()

    if (value) this.props.commentable.addComment(this.props.commentable.toggledReference, value)
    this.textareaRef.current.value = ''
  }

  handleRemoveComment(comment) {
    this.props.commentable.removeComment(comment)
  }

  handleClearComment() {
    this.textareaRef.current.value = ''
  }

  handleKeyPress(e) {
    if (e.key.toLowerCase() === 'enter' && !e.shiftKey) setTimeout(() => this.handleAddComment(), 5)
  }

  handleHideComments(e) {
    e.preventDefault()

    this.props.commentable.toggleComments()
  }

  render() {
    const comments = selectCommentsByReference(this.props.commentable,
      { resource: this.props.commentable.lastResourceRefreshed, reference: this.props.commentable.toggledReference }
    )

    const CommentComponent = this.props.commentComponent || DefaultCommentComponent

    return (
      <div className={this.props.className}>
        <div data-role="form">
          <h2>Add new comment</h2>
          <a href="#" data-role="close" onClick={this.boundHandleHideComments}>
            <CommentableIcon id="close" />
          </a>
          <textarea ref={this.textareaRef} onKeyPress={this.boundHandleKeyPress} />
          <button onClick={this.boundHandleClearComment}>Cancel</button>
          <button onClick={this.boundHandleAddComment}>Submit</button>
        </div>

        <div data-role="comments">
          <h2>Existing comments</h2>

          {comments.map(comment => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              onRemoveComment={this.boundHandleRemoveComment}
            />
          ))}
        </div>
      </div>
    )
  }
}

// FIXME find a way to test correctly a ContextContainer with a Portal
export class CommentableSidebar extends React.Component {
  /* istanbul ignore next */
  constructor(props) {
    super(props)

    this.target = document.getElementById('comments-sidebar-container')

    if (!this.target) {
      this.target = document.createElement('div')
      this.target.id = 'comments-sidebar-container'
      document.body.append(this.target)
    }
  }

  /* istanbul ignore next */
  render() {
    return (
      <CommentableContext.Consumer>
        {commentable => commentable.toggledReference && createPortal(
          <CommentableSidebarComponent
            {...this.props}
            commentable={commentable}
          />, this.target)}
      </CommentableContext.Consumer>
    )
  }
}
