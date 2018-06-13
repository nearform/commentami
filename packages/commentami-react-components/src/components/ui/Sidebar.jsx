import PropTypes from 'prop-types'
import React from 'react'
import { createPortal } from 'react-dom'
import { flexibleRender, withResource } from '../core/HOC'
import { DefaultSidebar } from './defaults/DefaultSidebar'
import { flexibleRenderPropInterface, sidebarsControllerPropInterface } from '../core/propInterfaces'
import { withSidebars } from './SidebarsController'

export function SidebarBase(props) {
  const {
    controller,
    commentami: { resource },
    render,
    component,
    children,
    className
  } = props

  if (!controller.isActive(resource)) return false

  return createPortal(
    <aside className={className}>
      {flexibleRender({ render, component, children }, { controller, props }, DefaultSidebar)}
    </aside>,
    document.body
  )
}

SidebarBase.displayName = 'SidebarBase'

SidebarBase.defaultProps = {
  className: 'nf-comments-sidebar'
}

SidebarBase.propTypes = {
  ...flexibleRenderPropInterface,
  controller: PropTypes.shape(sidebarsControllerPropInterface).isRequired,
  className: PropTypes.string
}

export const Sidebar = withSidebars(withResource(SidebarBase))
Sidebar.displayName = 'Sidebar'
