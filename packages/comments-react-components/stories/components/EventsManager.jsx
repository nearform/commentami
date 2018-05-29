import { CommentableEventsManager } from '../../src/components/CommentableEventsManager'

export class EventsManager extends CommentableEventsManager {
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
