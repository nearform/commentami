import React from 'react'

import { CommentableIcon, isValidSize } from './CommentableIcon'

export class CommentableMarker extends React.Component {
  render() {
    const MarkerComponent = this.props.markerComponent
    if (MarkerComponent) return <MarkerComponent rootRef={this.props.rootRef} handleToggleComment={this.props.handleToggleComment} />

    const { color, width, height } = this.props

    return (
      <span ref={this.props.rootRef} className={this.props.className} onDoubleClick={this.props.handleToggleComment} onClick={this.props.handleToggleComment}>
        <CommentableIcon width={width} height={height} color={color} id="comment" />
      </span>
    )
  }

  componentDidMount() {
    if (!this.props.className && !this.props.markerComponent) {
      const rootElement = this.props.rootRef.current
      const width = isValidSize(this.props.width) ? CommentableIcon.defaultSize : 22

      rootElement.style.position = 'absolute'
      rootElement.style.top = 0
      rootElement.style.left = `-${width}px`
    }
  }
}
