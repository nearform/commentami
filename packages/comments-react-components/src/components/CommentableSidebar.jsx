import React from 'react'
import { createPortal } from 'react-dom'

import { CommentableContext } from './CommentableProvider'
import { CommentableIcon } from './CommentableIcon'

function DefaultCommentComponent({ comment }) {
  return (
    <div>
      <h4>{comment.author} said:</h4>
      <p>{comment.content}</p>
    </div>
  )
}

class CommentableSidebarComponent extends React.Component {
  constructor(props) {
    super(props)

    this.textareaRef = React.createRef()

    this.boundHandleAddComment = this.handleAddComment.bind(this)
    this.boundHandleClearComment = this.handleClearComment.bind(this)
    this.boundHandleKeyPress = this.handleKeyPress.bind(this)
    this.boundHandleHideComments = this.handleHideComments.bind(this)
  }

  handleAddComment() {
    const value = (this.textareaRef.current.value || '').trim()

    if (value) this.props.commentable.addComment(this.props.commentable.toggledBlock, this.textareaRef.current.value)
    this.textareaRef.current.value = ''
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
    const comments = this.props.commentable.getBlockComments(this.props.commentable.toggledBlock)
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
          <button onClick={this.boundHandleAddComment}>Add a comment</button>
        </div>

        <div data-role="comments">
          <h2>Existing comments</h2>

          {comments.map(comment => <CommentComponent key={comment.id} comment={comment} />)}
        </div>
      </div>
    )
  }
}

export class CommentableSidebar extends React.Component {
  componentWillMount() {
    this.target = document.getElementById('comments-sidebar-root')

    if (!this.target) {
      this.target = document.createElement('div')
      this.target.style.position = 'fixed'
      this.target.style.right = 0
      this.target.style.top = 0

      document.body.append(this.target)
    }
  }

  render() {
    return (
      <CommentableContext.Consumer>
        {commentable => commentable.toggledBlock && createPortal(<CommentableSidebarComponent {...this.props} commentable={commentable} />, this.target)}
      </CommentableContext.Consumer>
    )
  }
}
