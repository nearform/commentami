import React from 'react'

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
      <article className={this.props.className || 'nf-comment'}>
        <h4 className="nf-comment__header">{this.props.comment.author} said:</h4>
        <p className="nf-comment__content">{this.props.comment.content}</p>
        <button type="button" className="nf-comment__remove-button" onClick={this.boundHandleRemove}>
          Remove
        </button>
      </article>
    )
  }
}
