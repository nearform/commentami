import PropTypes from 'prop-types'
import React from 'react'
import { CommentsList } from '../CommentsList'
import { Icon } from '../Icon'
import { NewCommentForm } from '../NewCommentForm'
import { sidebarsControllerPropInterface } from '../../core/propInterfaces'

export class DefaultSidebar extends React.Component {
  constructor(props) {
    super(props)

    this.rootRef = React.createRef()
    this.boundHandleClose = this.handleClose.bind(this)
  }

  handleClose(ev) {
    ev.preventDefault()

    const controller = this.props.controller
    const payload = {
      resource: controller.resource,
      reference: controller.reference,
      ref: this.rootRef,
      scope: 'sidebar-close'
    }

    if (typeof this.props.controller.handleClick === 'function') this.props.controller.handleClick(payload, ev)
  }

  // Icon from https://www.brandeps.com/icon/
  render() {
    const reference = this.props.controller.reference
    const className = this.props.className

    return (
      <div ref={this.rootRef} className={className}>
        <header className={`${className}__header`}>
          {this.props.title && <h1 className={`${className}__title`}>{this.props.title}</h1>}
          {typeof this.props.controller.handleClick === 'function' && (
            <a className={`${className}__close`} href="#" onClick={this.boundHandleClose}>
              <Icon
                viewBox="0 0 96 96"
                path="M48,16.3c-17.5,0-31.7,14.2-31.7,31.7S30.5,79.7,48,79.7S79.7,65.5,79.7,48S65.5,16.3,48,16.3z M63.8,59.4l-4.5,4.5L48,52.5L36.6,63.8l-4.5-4.5L43.5,48L32.2,36.6l4.5-4.5L48,43.5l11.4-11.4l4.5,4.5L52.5,48L63.8,59.4z" // eslint-disable-line max-len
              />
            </a>
          )}
        </header>
        {reference && <NewCommentForm reference={reference} />}
        {reference && <CommentsList reference={reference} />}
      </div>
    )
  }
}

DefaultSidebar.displayName = 'DefaultSidebar'

DefaultSidebar.defaultProps = {
  title: 'Comments',
  className: 'nf-commentami-sidebar'
}

DefaultSidebar.propTypes = {
  controller: PropTypes.shape(sidebarsControllerPropInterface).isRequired,
  title: PropTypes.string,
  className: PropTypes.string
}
