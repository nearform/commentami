import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'

import logger from '../adapters/logger'

class AppContainer extends React.Component {
  componentDidCatch(error, errorInfo) {
    logger.captureException(error, errorInfo)
  }

  render() {
    return <Fragment>{this.props.children}</Fragment>
  }
}

AppContainer.propTypes = {
  children: PropTypes.element.isRequired
}

export default hot(module)(AppContainer)
