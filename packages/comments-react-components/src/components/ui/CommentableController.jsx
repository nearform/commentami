import React from 'react'

export const CommentableControllerContext = React.createContext('controller')

export class CommentableController extends React.Component {
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
    return <CommentableControllerContext.Provider value={this.state} children={this.props.children} />
  }
}

export function commentableWithController(Component) {
  return function(props) {
    return <CommentableControllerContext.Consumer>{controller => <Component {...props} controller={controller} />}</CommentableControllerContext.Consumer>
  }
}