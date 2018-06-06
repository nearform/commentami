import React from 'react'
import { createPortal } from 'react-dom'
import { commentable, flexibleRender } from '../core/CommentableComponents'
import { commentableWithController } from './CommentableController'
import { CommentableDefaultSidebar } from './defaults/CommentableDefaultSidebar'

export const CommentableSidebar = commentableWithController(
  commentable(
    class extends React.Component {
      render() {
        const { controller, resource, render, component, children } = this.props

        if (!controller.isActive(resource)) return false

        return createPortal(
          <aside className={this.props.className || 'nf-comments-sidebar'}>
            {flexibleRender({ render, component, children }, { controller, ...this.props }, CommentableDefaultSidebar)}
          </aside>,
          document.body
        )
      }
    }
  )
)
