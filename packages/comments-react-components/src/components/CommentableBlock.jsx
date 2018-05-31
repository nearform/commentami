import React from 'react'
import warning from 'warning'

import { selectCommentsByReference } from '../state/selectors'
import { CommentableContext } from './CommentableProvider'
import { CommentableMarker } from './CommentableMarker'
import { CommentableEventsContext } from './CommentableEventsManager'

export class CommentableBlockComponent extends React.Component {
  constructor(props) {
    super(props)

    this.referenceId = this.props.referenceId
    this.rootRef = React.createRef()
    this.markerRef = React.createRef()

    /*
      Bind events to the current component
      Note: the events have already be bound on the eventsmanager, which means the new bind will append arguments but will not change the scope of this.
      See: https://stackoverflow.com/questions/20925138/bind-more-arguments-of-an-already-bound-function-in-javascript#comment31419400_20925268
    */
    const events = this.props.events
    const payload = { id: this.referenceId, ref: this.rootRef, scope: 'block' }
    this.boundHandleClick = events.onClick.bind(null, payload)
    this.boundHandleContextMenu = events.onContextMenu.bind(null, payload)
    this.boundHandleDoubleClick = events.onDoubleClick.bind(null, payload)
    this.boundHandleMouseEnter = events.onMouseEnter.bind(null, payload)
    this.boundHandleMouseLeave = events.onMouseLeave.bind(null, payload)
    this.boundHandleSelect = events.onSelect.bind(null, payload)
  }

  get hasCommentable() {
    // This check works since the consumer will provide the context default value, which is 'commentable'
    return this.props.commentable && this.props.commentable !== 'commentable'
  }

  get hasComments() {
    return this.hasCommentable && !!selectCommentsByReference(this.props.commentable, this.referenceId).length
  }

  get isToggled() {
    return this.props.commentable.toggledReference === this.referenceId
  }

  componentDidMount() {
    warning(this.hasCommentable, 'The CommentableBlock component should be inside a CommentableProvider')
    const rootElement = this.rootRef.current

    // FIXME wasn't possible from the test to check the value of rootElement.style.position
    /* istanbul ignore next */
    if (rootElement && window.getComputedStyle(rootElement).getPropertyValue('position') === 'static') rootElement.style.position = 'relative'
  }

  render() {
    if (!this.hasCommentable) return false

    return (
      <div
        ref={this.rootRef}
        className={this.props[this.isToggled ? 'highlightedClassName' : 'className']}
        onClick={this.boundHandleClick}
        onContextMenu={this.boundHandleContextMenu}
        onDoubleClick={this.boundHandleDoubleClick}
        onMouseEnter={this.boundHandleMouseEnter}
        onMouseLeave={this.boundHandleMouseLeave}
        onSelect={this.boundHandleSelect}
      >
        {this.hasComments && (
          <CommentableMarker
            referenceId={this.referenceId}
            rootRef={this.markerRef}
            className={this.props.markerClassName}
            markerComponent={this.props.markerComponent}
            events={this.props.events}
          />
        )}
        {this.props.children}
      </div>
    )
  }
}

// FIXME find a way to test correctly a ContextContainer
export class CommentableBlock extends React.Component {
  /* istanbul ignore next */
  render() {
    return (
      <CommentableContext.Consumer>
        {commentable => (
          <CommentableEventsContext.Consumer>
            {events => (
              <CommentableBlockComponent {...this.props} commentable={commentable} events={events}>
                {this.props.children}
              </CommentableBlockComponent>
            )}
          </CommentableEventsContext.Consumer>
        )}
      </CommentableContext.Consumer>
    )
  }
}
