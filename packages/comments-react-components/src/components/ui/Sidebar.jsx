import React from 'react'
import { createPortal } from 'react-dom'
import { withComments, flexibleRender } from '../core/HOC'
import { withSidebars } from './SidebarsController'
import { DefaultSidebar } from './defaults/DefaultSidebar'

export function SidebarBase(props) {
  const { controller, resource, render, component, children, className } = props

  if (!controller.isActive(resource)) return false

  return createPortal(
    <aside className={className || 'nf-comments-sidebar'}>
      {flexibleRender({ render, component, children }, { controller, props }, DefaultSidebar)}
    </aside>,
    document.body
  )
}

export const Sidebar = withSidebars(withComments(SidebarBase))
