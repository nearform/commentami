import React from 'react'
import PropTypes from 'prop-types'

import { withResource } from '../core/HOC'
import { DefaultComment } from './defaults/DefaultComment'

export function CommentsListBase({ commentable, reference, title, className, commentComponent: Component }) {
  const comments = commentable.listReferenceComments()

  if (!Component) Component = DefaultComment

  return (
    <section className={className}>
      {title && <h2 className="nf-comments-list__title">{title}</h2>}

      {comments.map(comment => (
        <Component key={comment.id} comment={comment} removeComment={commentable.removeComment} />
      ))}
    </section>
  )
}

CommentsListBase.displayName = 'CommentsListBase'

CommentsListBase.defaultProps = {
  className: 'nf-comments-list'
}

CommentsListBase.propTypes = {
  commentable: PropTypes.shape({
    removeComment: PropTypes.func,
    listReferenceComments: PropTypes.func.isRequired
  }).isRequired,

  reference: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ]),

  title: PropTypes.string,
  className: PropTypes.string,
  commentComponent: PropTypes.func
}

export const CommentsList = withResource(CommentsListBase)
CommentsList.displayName = 'Comments'
