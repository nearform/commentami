import { px, viewHeight, viewWidth } from 'csx'
import React from 'react'
import { style } from 'typestyle'
import { CommentableCommentsList } from '../../src/components/ui/CommentableCommentsList'
import { CommentableNewForm } from '../../src/components/ui/CommentableNewForm'

const sidebarClassName = style({
  backgroundColor: '#F0F0F0',
  borderLeft: `${px(2)} solid #808080`,
  zIndex: 10,
  padding: px(15),
  width: px(300),
  maxWidth: viewWidth(75),
  height: viewHeight(100),
  position: 'fixed',
  top: 0,
  right: 0,
  $nest: {
    h2: {
      gridArea: 'title'
    },
    textarea: {
      gridArea: 'text'
    },
    button: {
      $nest: {
        '&:first-of-type': {
          gridArea: 'secondary'
        },
        '&:last-of-type': {
          gridArea: 'primary'
        }
      }
    }
  }
})

const formClassName = style({
  display: 'grid',
  gridTemplate: `
  "title  title     title" min-content
  "text   text      text" min-content
  "null   secondary primary" min-content
  / 2fr 1fr 1fr
  `,
  gridGap: px(10),
  justifyContent: 'flex-end'
})

class Comment extends React.Component {
  constructor(props) {
    super(props)

    this.boundHandleRemove = this.handleRemove.bind(this)
  }

  handleRemove(ev) {
    ev.preventDefault()

    return this.props.removeComment(this.props.comment)
  }

  render() {
    return (
      <article>
        <h5>{this.props.comment.author} said:</h5>
        <p>{this.props.comment.content}</p>
        <a href="#" onClick={this.boundHandleRemove}>
          Remove
        </a>

        <hr />
      </article>
    )
  }
}

export class Sidebar extends React.Component {
  constructor(props) {
    super(props)

    this.boundHandleClose = this.handleClose.bind(this)
  }

  handleClose(ev) {
    ev.preventDefault()

    this.props.sidebars.updateActive()
  }

  render() {
    const reference = this.props.sidebars.reference

    return (
      <div className={sidebarClassName}>
        <header>
          <h1>{this.props.title || 'Comments'}</h1>
          <a href="#" onClick={this.boundHandleClose}>
            Close
          </a>
        </header>
        <CommentableNewForm reference={reference} className={formClassName} />
        <CommentableCommentsList reference={reference} commentComponent={Comment} />
      </div>
    )
  }
}
