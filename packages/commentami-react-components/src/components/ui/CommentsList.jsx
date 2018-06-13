import PropTypes from 'prop-types'
import React from 'react'
import { withReference } from '../core/HOC'
import { DefaultComment } from './defaults/DefaultComment'

export function CommentsListBase({ commentami, reference, title, className, commentComponent: Component }) {
  const comments = commentami.listReferenceComments()

  if (!Component) Component = DefaultComment

  return (
    <section className={className}>
      {title && <h2 className="nf-comments-list__title">{title}</h2>}

      {comments.map(comment => (
        <Component key={comment.id} comment={comment} removeComment={commentami.removeComment} />
      ))}
    </section>
  )
}

CommentsListBase.displayName = 'CommentsListBase'

CommentsListBase.defaultProps = {
  className: 'nf-comments-list'
}

CommentsListBase.propTypes = {
  commentami: PropTypes.shape({
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

export const CommentsList = withReference(CommentsListBase)
CommentsList.displayName = 'Comments'
