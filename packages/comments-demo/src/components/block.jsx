import { CommentableSidebarsContext } from '@nearform/comments-react-components/dist/ui'
import { rem } from 'csx'
import { Icon } from './icon'
import React from 'react'
import { classes, style } from 'typestyle'

const blockClassName = style({
  position: 'relative',
  $nest: {
    '&:hover': {
      backgroundColor: '#FFF9C4',
      color: 'black'
    }
  }
})

const highlightedBlockClassName = style({
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

export class BlockComponent extends React.Component {
  constructor(props) {
    super(props)

    this.rootRef = React.createRef()

    const payload = { resource: this.props.commentable.resource, reference: this.props.reference, ref: this.rootRef, scope: 'block' }
    this.boundHandleShowComments = this.handleShowComments.bind(this, payload)
  }

  get isToggled() {
    const { resource, reference } = this.props

    return this.props.sidebars.isActive(resource, reference)
  }

  handleShowComments(payload, event) {
    event.preventDefault()

    const { resource, reference } = this.props

    this.props.sidebars.isActive(resource, reference) ? this.props.sidebars.updateActive() : this.props.sidebars.updateActive(resource, reference)

    const sel = window.getSelection()
    sel.removeAllRanges()
  }

  render() {
    let { children, hasComments, markerComponent: Marker } = this.props

    if (!Marker) Marker = CommentsMarker

    return (
      <div ref={this.rootRef} onDoubleClick={this.boundHandleShowComments} className={classes(blockClassName, this.isToggled ? highlightedBlockClassName : '')}>
        {hasComments && <Marker onClick={this.boundHandleShowComments} />}
        {children}
      </div>
    )
  }
}

export function Block(props) {
  return <CommentableSidebarsContext.Consumer>{sidebars => <BlockComponent {...props} sidebars={sidebars} />}</CommentableSidebarsContext.Consumer>
}
