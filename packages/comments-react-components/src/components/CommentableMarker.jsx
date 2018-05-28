import React from 'react'

import { CommentableIcon, isValidSize } from './CommentableIcon'

export class CommentableMarker extends React.Component {
  render() {
    const { color, width, height } = this.props

    return (
      <span ref={this.props.rootRef} className={this.props.className} onDoubleClick={this.props.handleToggleComment} onClick={this.props.handleToggleComment}>
        {this.props.children || <CommentableIcon width={width} height={height} color={color} id="comment" />}
      </span>
    )
  }

  componentDidMount() {
    if (!this.props.className) {
      const rootElement = this.props.rootRef.current
      const width = isValidSize(this.props.width) ? CommentableIcon.defaultSize : 22

      rootElement.style.position = 'absolute'
      rootElement.style.top = 0
      rootElement.style.left = `-${width}px`
    }
  }
}
