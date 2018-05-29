import React from 'react'

import { CommentableIcon } from './CommentableIcon'

export class CommentableMarker extends React.Component {
  constructor(props) {
    super(props)

    this.boundHandleClick = this.props.events.onClick.bind(null, { id: this.props.referenceId, ref: this.props.rootRef, scope: 'marker' })
  }

  render() {
    const MarkerComponent = this.props.markerComponent
    if (MarkerComponent) return <MarkerComponent {...this.props} />

    const { color, width, height } = this.props

    return (
      <span ref={this.props.rootRef} className={this.props.className || 'comments-marker'} onClick={this.boundHandleClick}>
        <CommentableIcon width={width} height={height} color={color} id="comment" />
      </span>
    )
  }
}
