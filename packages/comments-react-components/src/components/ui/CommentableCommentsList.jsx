import React from 'react'
import { CommentableComponent } from '../core/CommentableComponent'
import { selectCommentsByReference } from '../../state/selectors'

export class CommentableCommentsList extends CommentableComponent {
  renderCommentable() {
    const { title, reference, commentComponent: Comment } = this.props
    const comments = selectCommentsByReference(this.commentable, reference)

    return (
      <section className={this.props.className || 'nf-comments-list'}>
        {title && <h2 className="nf-comments-list__title">{title}</h2>}

        {comments.map(comment => <Comment key={comment.id} comment={comment} removeComment={this.commentable.removeComment} />)}
      </section>
    )
  }
}
