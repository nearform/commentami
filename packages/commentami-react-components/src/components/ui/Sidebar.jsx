import PropTypes from 'prop-types'
import React from 'react'
import { createPortal } from 'react-dom'
import { flexibleRender, withResource } from '../core/HOC'
import { DefaultSidebar } from './defaults/DefaultSidebar'
import { withSidebars } from './SidebarsController'

export function SidebarBase(props) {
  const { controller, resource, render, component, children, className } = props

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
  controller: PropTypes.shape({
    isActive: PropTypes.func.isRequired
  }),

  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),

  resource: PropTypes.string,

  render: PropTypes.func,

  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  className: PropTypes.string
}

export const Sidebar = withSidebars(withResource(SidebarBase))
Sidebar.displayName = 'Sidebar'
