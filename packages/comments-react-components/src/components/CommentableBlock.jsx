import React from 'react'
import warning from 'warning'

import { CommentableContext } from './CommentableProvider'
import { CommentableMarker } from './CommentableMarker'

export const CommentableBlockContext = React.createContext('commentableTextBlock')

class CommentableBlockComponent extends React.Component {
  constructor(props) {
    super(props)

    this.referenceId = this.props.referenceId
    this.blockRef = React.createRef()
    this.markerRef = React.createRef()

    this.boundHandleDoubleClick = this.handleDoubleClick.bind(this)
    this.boundHandleToggleComment = this.handleToggleComment.bind(this)
  }

  get hasCommentable() {
    return this.props.commentable && typeof this.props.commentable.getBlockComments === 'function'
  }

  get hasComments() {
    return this.hasCommentable && !!this.props.commentable.getBlockComments(this.referenceId).length
  }

  get isToggled() {
    return this.props.commentable.toggledBlock === this.referenceId
  }

  handleDoubleClick(e) {
    e.preventDefault()
    this.props.commentable.toggleComments(this.referenceId)

    const sel = window.getSelection()
    sel.removeAllRanges()
  }

  handleToggleComment(e) {
    e.preventDefault()
    this.props.commentable.toggleComments(this.referenceId)
  }

  componentDidMount() {
    warning(this.hasCommentable, 'The CommentableTextBlock component should be inside a CommentableProvider')
    const rootElement = this.blockRef.current

    if (window.getComputedStyle(rootElement).getPropertyValue('position') === 'static') rootElement.style.position = 'relative'
  }

  render() {
    if (!this.hasCommentable) {
      return false
    }

    return (
      <div ref={this.blockRef} className={this.props[this.isToggled ? 'highlightedClassName' : 'className']} onDoubleClick={this.boundHandleDoubleClick}>
        {this.hasComments && (
          <CommentableMarker rootRef={this.markerRef} markerComponent={this.props.markerComponent} handleToggleComment={this.boundHandleToggleComment} />
        )}
        {this.props.children}
      </div>
    )
  }
}

export class CommentableBlock extends React.Component {
  render() {
    return (
      <CommentableContext.Consumer>
        {commentable => (
          <CommentableBlockComponent {...this.props} commentable={commentable}>
            {this.props.children}
          </CommentableBlockComponent>
        )}
      </CommentableContext.Consumer>
    )
  }
}
