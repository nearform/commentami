import React from 'react'
import PropTypes from 'prop-types'

import { DefaultSidebar } from './defaults/DefaultSidebar'

import { DeepLinkController } from './DeepLinkController'
import { SidebarsController, withSidebars } from './SidebarsController'
import { loggerPropInterface, Resource, servicePropInterface } from '../core/Resource'
import { childrenPropInterface } from '../core/propInterfaces'

export class Commentami extends React.Component {
  render() {
    const {
      LoadingIndicator,
      loadingIndicatorProps,
      ErrorIndicator,
      errorIndicatorProps,
      Sidebar,
      sidebarProps
    } = this.props

    return (
      <DeepLinkController>
        <SidebarsController>
          <Resource resource={this.props.resource} service={this.props.service} logger={this.props.logger}>
            {LoadingIndicator && <LoadingIndicator {...loadingIndicatorProps} />}
            {ErrorIndicator && <ErrorIndicator {...errorIndicatorProps} />}
            {this.props.children}
            <Sidebar {...sidebarProps} />
          </Resource>
        </SidebarsController>
      </DeepLinkController>
    )
  }
}

Commentami.defaultProps = {
  Sidebar: withSidebars(DefaultSidebar),
  loadingIndicatorProps: {},
  errorIndicatorProps: {},
  sidebarProps: {}
}

Commentami.propTypes = {
  service: PropTypes.shape(servicePropInterface),
  logger: PropTypes.shape(loggerPropInterface),
  resource: PropTypes.string.isRequired,
  LoadingIndicator: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  loadingIndicatorProps: PropTypes.object,
  ErrorIndicator: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  errorIndicatorProps: PropTypes.object,
  Sidebar: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  sidebarProps: PropTypes.shape({
    title: PropTypes.string,
    className: PropTypes.string
  }),
  children: childrenPropInterface
}
