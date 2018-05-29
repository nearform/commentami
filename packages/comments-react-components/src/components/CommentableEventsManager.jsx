import React from 'react'
import warning from 'warning'

import { CommentableContext } from './CommentableProvider'

export const CommentableEventsContext = React.createContext('events')

export class CommentableEventsManager extends React.Component {
  constructor(props) {
    super(props)

    this.context = React.createContext('context')

    this.state = {
      onClick: this.handleOnClick.bind(this),
      onContextMenu: this.handleOnContextMenu.bind(this),
      onDoubleClick: this.handleOnDoubleClick.bind(this),
      onMouseEnter: this.handleOnMouseEnter.bind(this),
      onMouseLeave: this.handleOnMouseLeave.bind(this),
      onSelect: this.handleOnSelect.bind(this)
    }
  }

  get hasCommentable() {
    // This check works since the consumer will provide the context default value, which is 'commentable'
    return this.props.commentable !== 'commentable'
  }

  // All events below are no-op by default - It's
  handleOnClick(payload, event) {}

  handleOnDoubleClick(payload, event) {}

  handleOnContextMenu(payload, event) {}

  handleOnSelect(payload, event) {}

  handleOnMouseEnter(payload, event) {}

  handleOnMouseLeave(payload, event) {}

  componentDidMount() {
    warning(this.hasCommentable, 'The CommentableEventsManager component should be inside a CommentableProvider')
  }

  render() {
    if (!this.hasCommentable) return false

    return <CommentableEventsContext.Provider value={this.state}>{this.props.children}</CommentableEventsContext.Provider>
  }
}

export class CommentableDefaultEventsManager extends CommentableEventsManager {
  handleOnDoubleClick(payload, event) {
    event.preventDefault()

    this.props.commentable.toggleComments(payload.id)

    const sel = window.getSelection()
    sel.removeAllRanges()
  }

  handleOnClick(payload, event) {
    event.preventDefault()

    if (payload.scope === 'marker') {
      event.stopPropagation() // Do not trigger a parent click event
    } else {
      return
    }

    this.props.commentable.toggleComments(payload.id)
  }
}

export function CommentableEventsManagerWrapper({ component: Component, children }) {
  if (!Component) Component = CommentableDefaultEventsManager

  return <CommentableContext.Consumer>{commentable => <Component children={children} commentable={commentable} />}</CommentableContext.Consumer>
}
