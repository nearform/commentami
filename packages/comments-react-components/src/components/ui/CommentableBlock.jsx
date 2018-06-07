import React from 'react'
import { commentable } from '../core/CommentableComponents'
import { commentableWithController } from './CommentableController'
import { CommentableDefaultMarker } from './defaults/CommentableDefaultMarker'

export class CommentableBlockBase extends React.Component {
  constructor(props) {
    super(props)

    this.rootRef = React.createRef()
    this._updateEvents()
  }

  get isActive() {
    const { controller, resource, reference } = this.props

    return controller.isActive(resource, reference)
  }

  render() {
    let { children, hasComments, activeClassName, markerComponent: Marker, controller, resource, reference } = this.props

    if (!activeClassName) activeClassName = 'nf-comments-block--active'
    if (!Marker) Marker = CommentableDefaultMarker

    return (
      <div
        ref={this.rootRef}
        className={['nf-comments-block', this.isActive ? activeClassName : ''].filter(a => a).join(' ')}
        onClick={this.boundHandleClick}
        onContextMenu={this.boundHandleContextMenu}
        onDoubleClick={this.boundHandleDoubleClick}
        onMouseEnter={this.boundHandleMouseEnter}
        onMouseLeave={this.boundHandleMouseLeave}
        onSelect={this.boundHandleSelect}
      >
        {hasComments && <Marker controller={controller} resource={resource} reference={reference} onClick={this.boundHandleDoubleClick} />}
        {children}
      </div>
    )
  }

  _updateEvents() {
    const controller = this.props.controller
    const payload = { resource: this.props.resource, reference: this.props.reference, ref: this.rootRef, scope: 'block' }

    this.boundHandleClick = typeof controller.handleClick === 'function' ? controller.handleClick.bind(controller, payload) : null
    this.boundHandleContextMenu = typeof controller.handleContextMenu === 'function' ? controller.handleContextMenu.bind(controller, payload) : null
    this.boundHandleDoubleClick = typeof controller.handleDoubleClick === 'function' ? controller.handleDoubleClick.bind(controller, payload) : null
    this.boundHandleMouseEnter = typeof controller.handleMouseEnter === 'function' ? controller.handleMouseEnter.bind(controller, payload) : null
    this.boundHandleMouseLeave = typeof controller.handleMouseLeave === 'function' ? controller.handleMouseLeave.bind(controller, payload) : null
    this.boundHandleSelect = typeof controller.handleSelect === 'function' ? controller.handleSelect.bind(controller, payload) : null
  }
}

export const CommentableBlock = commentableWithController(commentable(CommentableBlockBase))
