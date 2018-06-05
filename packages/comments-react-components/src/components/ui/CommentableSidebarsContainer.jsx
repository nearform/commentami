import React from 'react'

export const CommentableSidebarsContext = React.createContext('sidebars')

export class CommentableSidebarsContainer extends React.Component {
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
      }
    }
  }

  render() {
    return <CommentableSidebarsContext.Provider value={this.state} children={this.props.children} />
  }
}
