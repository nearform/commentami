import PropTypes from 'prop-types'
import React from 'react'
import { withReference } from '../core/HOC'
import { DefaultMarker } from './defaults/DefaultMarker'
import { withSidebars } from './SidebarsController'

export class ReferenceBase extends React.Component {
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
    let {
      children,
      commentami = {},
      activeClassName,
      markerComponent: Marker,
      controller,
      resource,
      reference
    } = this.props

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
        {commentami.hasComments && (
          <Marker
            controller={controller}
            resource={resource}
            reference={reference}
            onClick={this.boundHandleDoubleClick}
          />
        )}
        {children}
      </div>
    )
  }

  _updateEvents() {
    const controller = this.props.controller
    const payload = {
      resource: this.props.resource,
      reference: this.props.reference,
      ref: this.rootRef,
      scope: 'block'
    }

    const bindEvent = handler => (typeof handler === 'function' ? handler.bind(controller, payload) : null)

    this.boundHandleClick = bindEvent(controller.handleClick)
    this.boundHandleContextMenu = bindEvent(controller.handleContextMenu)
    this.boundHandleDoubleClick = bindEvent(controller.handleDoubleClick)
    this.boundHandleMouseEnter = bindEvent(controller.handleMouseEnter)
    this.boundHandleMouseLeave = bindEvent(controller.handleMouseLeave)
    this.boundHandleSelect = bindEvent(controller.handleSelect)
  }
}

ReferenceBase.displayName = 'ReferenceBase'
ReferenceBase.defaultProps = {
  activeClassName: 'nf-comments-block--active',
  markerComponent: DefaultMarker
}

ReferenceBase.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,

  activeClassName: PropTypes.string,

  markerComponent: PropTypes.func,

  commentami: PropTypes.shape({
    hasComments: PropTypes.bool
  }).isRequired,

  resource: PropTypes.string.isRequired,

  reference: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ]).isRequired,

  controller: PropTypes.shape({
    handleClick: PropTypes.func,
    handleContextMenu: PropTypes.func,
    handleDoubleClick: PropTypes.func,
    handleMouseEnter: PropTypes.func,
    handleMouseLeave: PropTypes.func,
    handleSelect: PropTypes.func
  })
}

export const Reference = withSidebars(withReference(ReferenceBase))

Reference.displayName = 'Reference'
