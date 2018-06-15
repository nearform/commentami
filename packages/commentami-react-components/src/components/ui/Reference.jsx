import PropTypes from 'prop-types'
import React from 'react'
import { withReference } from '../core/HOC'
import { DefaultMarker } from './defaults/DefaultMarker'
import {
  childrenPropInterface,
  commentamiDeeplinkPropType,
  commentamiReferencePropInterface,
  componentPropInterface,
  referencePropInterface
} from '../core/propInterfaces'
import { sidebarsControllerPropInterface, withSidebars } from './SidebarsController'
import { withDeepLink } from './DeepLinkController'

export class ReferenceBase extends React.Component {
  constructor(props) {
    super(props)

    this.rootRef = React.createRef()
    this._updateEvents()
  }

  componentDidMount() {
    if (
      this.props.commentamiDeeplink &&
      this.props.commentamiDeeplink.hasDeepLink &&
      this.props.commentamiDeeplink.resource === this.props.commentami.resource &&
      this.props.commentamiDeeplink.reference === this.props.commentami.reference
    ) {
      this.props.commentamiDeeplink.scrollIntoView(this.rootRef.current)
    }
  }

  get isActive() {
    const {
      controller,
      commentami: { resource, reference }
    } = this.props

    return controller.isActive(resource, reference)
  }

  render() {
    let {
      children,
      commentami,
      className,
      activeClassName,
      markerComponent: Marker,
      controller,
      reference
    } = this.props

    if (!activeClassName) activeClassName = `${className}--active`

    return (
      <div
        ref={this.rootRef}
        className={[className, this.isActive ? activeClassName : ''].filter(a => a).join(' ')}
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
            resource={commentami.resource}
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
      resource: this.props.commentami.resource,
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
  className: 'nf-commentami-reference',
  markerComponent: DefaultMarker
}

ReferenceBase.propTypes = {
  commentami: PropTypes.shape(commentamiReferencePropInterface).isRequired,
  commentamiDeeplink: PropTypes.shape(commentamiDeeplinkPropType),
  controller: PropTypes.shape(sidebarsControllerPropInterface).isRequired,
  reference: referencePropInterface.isRequired,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  children: childrenPropInterface,
  markerComponent: componentPropInterface
}

export const Reference = withDeepLink(withSidebars(withReference(ReferenceBase)))

Reference.displayName = 'Reference'
