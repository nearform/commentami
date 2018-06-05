import React from 'react'
import { CommentableComponent } from '../core/CommentableComponent'
import { CommentableComment } from './CommentableComment'
import { selectCommentsByReference } from '../../state/selectors'

export class CommentableCommentsList extends CommentableComponent {
  renderCommentable() {
    let { title, reference, commentComponent: Component } = this.props
    const comments = selectCommentsByReference(this.commentable, reference)

    if (!Component) Component = CommentableComment

    return (
      <section className={this.props.className || 'nf-comments-list'}>
        {title && <h2 className="nf-comments-list__title">{title}</h2>}

        {comments.map(comment => <Component key={comment.id} comment={comment} removeComment={this.commentable.removeComment} />)}
      </section>
    )
  }
}
