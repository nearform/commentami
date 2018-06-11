import React from 'react'
import PropTypes from 'prop-types'

export const SidebarsControllerContext = React.createContext('controller')

export class SidebarsController extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      resource: null,
      reference: null,

      // Methods / Callback
      isActive: this.isActive.bind(this),
      updateActive: this.updateActive.bind(this),
      toggleActive: this.toggleActive.bind(this),
      handleClick: this.handleClick.bind(this),
      handleDoubleClick: this.handleDoubleClick.bind(this)
    }
  }

  handleClick(payload, event) {
    switch (payload.scope) {
      case 'marker':
        this.toggleActive(payload)
        break
      case 'sidebar-close':
        this.state.updateActive()
        break
    }
  }

  isActive(resource, reference) {
    return this.state.resource === resource && (!reference || this.state.reference === reference)
  }

  updateActive(resource, reference) {
    this.setState(() => ({ resource, reference }))
  }

  toggleActive(payload) {
    const { resource, reference } = payload

    this.isActive(resource, reference) ? this.updateActive() : this.updateActive(resource, reference)
  }

  handleDoubleClick(payload, event) {
    this.toggleActive(payload)

    const sel = window.getSelection()
    sel.removeAllRanges()
  }

  render() {
    return <SidebarsControllerContext.Provider value={this.state} children={this.props.children} />
  }
}

SidebarsController.displayName = 'SidebarsController'

SidebarsController.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}

export function withSidebars(Component) {
  const WithSidebars = function(props) {
    return (
      <SidebarsControllerContext.Consumer>
        {controller => <Component {...props} controller={controller} />}
      </SidebarsControllerContext.Consumer>
    )
  }

  WithSidebars.displayName = `WithSidebars(${Component.displayName || Component.name})`

  return WithSidebars
}
