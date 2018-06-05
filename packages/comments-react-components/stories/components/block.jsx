import React from 'react'
import { style } from 'typestyle'
import { CommentableSidebarsContext } from '../../src/components/ui/CommentableSidebarsContainer'

const highlightedBlockClassName = style({
  backgroundColor: '#FDD835',
  color: 'black'
})

function CommentsMarker({ onClick }) {
  return (
    <a href="#" onClick={onClick}>
      Toggle Comments
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
      <div ref={this.rootRef} onDoubleClick={this.boundHandleShowComments} className={this.isToggled ? highlightedBlockClassName : ''}>
        {hasComments && <Marker onClick={this.boundHandleShowComments} />}
        {children}
      </div>
    )
  }
}

export function Block(props) {
  return <CommentableSidebarsContext.Consumer>{sidebars => <BlockComponent {...props} sidebars={sidebars} />}</CommentableSidebarsContext.Consumer>
}
