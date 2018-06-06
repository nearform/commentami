import React from 'react'

export const CommentableControllerContext = React.createContext('controller')

export class CommentableController extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      resource: null,
      reference: null,
      isActive: (resource, reference) => {
        return this.state.resource === resource && (!reference || this.state.reference === reference)
      },
      updateActive: (resource, reference) => {
        this.setState(() => ({ resource, reference }))
      },
      handleClick: this.handleClick.bind(this),
      handleDoubleClick: this.handleDoubleClick.bind(this)
    }
  }

  toggleActive(payload) {
    const { resource, reference } = payload
    this.state.isActive(resource, reference) ? this.state.updateActive() : this.state.updateActive(resource, reference)
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
