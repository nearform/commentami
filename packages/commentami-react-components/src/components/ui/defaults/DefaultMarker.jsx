import PropTypes from 'prop-types'
import React from 'react'
import { referencePropInterface, sidebarsControllerPropInterface } from '../../core/propInterfaces'
import { Icon } from '../Icon'

export class DefaultMarker extends React.Component {
  constructor(props) {
    super(props)

    let { controller, rootRef: ref, resource, reference } = this.props

    if (typeof controller.handleClick === 'function')
      this.boundHandleClick = controller.handleClick.bind(null, {
        resource,
        reference,
        ref,
        scope: 'marker'
      })
  }

  // Icon from https://www.brandeps.com/icon/
  render() {
    return (
      <span ref={this.props.rootRef} className={this.props.className} onClick={this.boundHandleClick}>
        <Icon
          viewBox="0 0 96 96"
          path="M77.1,24.7c0-3.2-2.6-5.8-5.8-5.8H24.7c-3.2,0-5.8,2.6-5.8,5.8v35c0,3.2,2.6,5.8,5.8,5.8h40.8 l11.7,11.7L77.1,24.7z M65.5,53.8h-35V48h35V53.8z M65.5,45.1h-35v-5.8h35V45.1z M65.5,36.3h-35v-5.8h35V36.3z" // eslint-disable-line max-len
        />
      </span>
    )
  }
}

DefaultMarker.displayName = 'DefaultMarker'

DefaultMarker.defaultProps = {
  className: 'nf-commentami-marker'
}

DefaultMarker.propTypes = {
  controller: PropTypes.shape(sidebarsControllerPropInterface).isRequired,
  resource: PropTypes.string.isRequired,
  reference: referencePropInterface.isRequired,
  rootRef: PropTypes.object,
  className: PropTypes.string
}
