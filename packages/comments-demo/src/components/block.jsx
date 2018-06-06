import { commentableBlock } from '@nearform/comments-react-components'
import { commentableWithController } from '@nearform/comments-react-components/dist/ui'
import { rem } from 'csx'
import React from 'react'
import { classes, style } from 'typestyle'
import { Icon } from './icon'

const blockClassName = style({
  position: 'relative',
  $nest: {
    '&:hover': {
      backgroundColor: '#FFF9C4',
      color: 'black'
    }
  }
})

const activeBlockClassName = style({
  backgroundColor: '#FDD835',
  color: 'black'
})

const blockCommentsMarkerClassName = style({
  position: 'absolute',
  top: 0,
  left: rem(-5.3) // 48px is the size of the icon, 2.5rem=25px is to put "outside" the page
})

function CommentsMarker({ onClick }) {
  return (
    <a href="#" onClick={onClick} className={blockCommentsMarkerClassName}>
      <Icon name="comments" />
    </a>
  )
}

export const Block = commentableWithController(
  commentableBlock(
    class extends React.Component {
      constructor(props) {
        super(props)

        this.rootRef = React.createRef()

        const payload = { resource: this.props.commentable.resource, reference: this.props.reference, ref: this.rootRef, scope: 'block' }
        this.boundHandleShowComments = this.handleShowComments.bind(this, payload)
      }

      handleShowComments(payload, event) {
        event.preventDefault()

        const { resource, reference } = this.props

        this.props.controller.isActive(resource, reference) ? this.props.controller.updateActive() : this.props.controller.updateActive(resource, reference)

        const sel = window.getSelection()
        sel.removeAllRanges()
      }

      render() {
        let { children, hasComments, markerComponent: Marker, resource, reference } = this.props

        const isActive = this.props.controller.isActive(resource, reference)

        if (!Marker) Marker = CommentsMarker

        return (
          <div ref={this.rootRef} onDoubleClick={this.boundHandleShowComments} className={classes(blockClassName, isActive ? activeBlockClassName : '')}>
            {hasComments && <Marker onClick={this.boundHandleShowComments} />}
            {children}
          </div>
        )
      }
    }
  )
)
