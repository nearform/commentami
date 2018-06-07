import React from 'react'
import { createPortal } from 'react-dom'
import { commentable, flexibleRender } from '../core/CommentableComponents'
import { commentableWithController } from './CommentableController'
import { CommentableDefaultSidebar } from './defaults/CommentableDefaultSidebar'

export function CommentableSidebarBase(props) {
  const { controller, resource, render, component, children, className } = props

  if (!controller.isActive(resource)) return false

  return createPortal(
    <aside className={className || 'nf-comments-sidebar'}>
      {flexibleRender({ render, component, children }, { controller, props }, CommentableDefaultSidebar)}
    </aside>,
    document.body
  )
}

export const CommentableSidebar = commentableWithController(commentable(CommentableSidebarBase))
