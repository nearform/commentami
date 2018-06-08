import React from 'react'
import { selectCommentsByReference } from '../../state/selectors'
import { commentable } from '../core/CommentableComponents'
import { DefaultComment } from './defaults/DefaultComment'

export function CommentsListBase({ commentable, reference, title, className, commentComponent: Component }) {
  const comments = selectCommentsByReference(commentable, reference)

  if (!Component) Component = DefaultComment

  return (
    <section className={className || 'nf-comments-list'}>
      {title && <h2 className="nf-comments-list__title">{title}</h2>}

      {comments.map(comment => (
        <Component key={comment.id} comment={comment} removeComment={commentable.removeComment} />
      ))}
    </section>
  )
}

export const CommentsList = commentable(CommentsListBase)
