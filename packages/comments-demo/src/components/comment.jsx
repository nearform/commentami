import React from 'react'
import { rem } from 'csx'
import { style } from 'typestyle'
import { Icon } from './icon'

const commentClassName = style({
  margin: `${rem(1)} 0 0 0`,
  border: `${rem(0.1)} solid #E0E0E0`,
  backgroundColor: 'white',
  padding: rem(1),
  $nest: {
    p: {
      marginBottom: rem(0)
    }
  }
})

const commentHeaderClassName = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

const removeIconClassName = style({
  width: rem(2),
  height: rem(2)
})

export class Comment extends React.Component {
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
      <article className={commentClassName}>
        <header className={commentHeaderClassName}>
          <h5>{this.props.comment.author}</h5>
          <a href="#" onClick={this.boundHandleRemove}>
            <Icon name="trash" className={removeIconClassName} />
          </a>
        </header>

        <p>{this.props.comment.content}</p>
      </article>
    )
  }
}
