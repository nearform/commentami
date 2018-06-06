import React from 'react'
import { commentable } from '../core/CommentableComponents'
import { commentableWithController } from './CommentableController'
import { CommentableDefaultMarker } from './defaults/CommentableDefaultMarker'

export const CommentableBlock = commentableWithController(
  commentable(
    class extends React.Component {
      constructor(props) {
        super(props)

        this.rootRef = React.createRef()
      }

      get isActive() {
        const { controller, resource, reference } = this.props

        return controller.isActive(resource, reference)
      }

      render() {
        this.updateEvents()

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

      updateEvents() {
        const controller = this.props.controller
        const payload = { resource: this.props.resource, reference: this.props.reference, ref: this.rootRef, scope: 'block' }

        for (const event of ['Click', 'ContextMenu', 'DoubleClick', 'MouseEnter', 'MouseLeave', 'Select']) {
          const handler = controller[`handle${event}`]
          this[`boundHandle${event}`] = typeof handler === 'function' ? handler.bind(controller, payload) : null
        }
      }
    }
  )
)
