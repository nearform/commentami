import React from 'react'
import { createPortal } from 'react-dom'
import { CommentableComponent } from '../core/CommentableComponent'
import { CommentableContext } from '../core/CommentableProvider'
import { CommentableSidebarsContext } from './CommentableSidebarsContainer'

export class CommentableSidebar extends CommentableComponent {
  get renderProps() {
    return { ...this.props, commentable: this.commentable, sidebars: this.sidebars }
  }

  render() {
    return (
      <CommentableContext.Consumer>
        {commentable => <CommentableSidebarsContext.Consumer>{sidebars => this._renderInner(commentable, sidebars)}</CommentableSidebarsContext.Consumer>}
      </CommentableContext.Consumer>
    )
  }

  _renderInner(commentable, sidebars) {
    this.commentable = commentable
    this.sidebars = sidebars

    if (!this.sidebars.isActive(this.commentable.resource)) return false

    return createPortal(<aside className={this.props.className || 'nf-comments-sidebar'}>{super._renderInner(commentable)}</aside>, document.body)
  }
}
