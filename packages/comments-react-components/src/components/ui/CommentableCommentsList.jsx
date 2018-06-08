import React from 'react'
import { selectCommentsByReference } from '../../state/selectors'
import { commentable } from '../core/CommentableComponents'
import { CommentableDefaultComment } from './defaults/CommentableDefaultComment'

export function CommentableCommentsListBase({ commentable, reference, title, className, commentComponent: Component }) {
  const comments = selectCommentsByReference(commentable, reference)

  if (!Component) Component = CommentableDefaultComment

  return (
    <section className={className || 'nf-comments-list'}>
      {title && <h2 className="nf-comments-list__title">{title}</h2>}

      {comments.map(comment => (
        <Component key={comment.id} comment={comment} removeComment={commentable.removeComment} />
      ))}
    </section>
  )
}

export const CommentableCommentsList = commentable(CommentableCommentsListBase)
