import React from 'react'

export class DefaultComment extends React.Component {
  constructor(props) {
    super(props)

    this.boundHandleRemove = this.handleRemove.bind(this)
  }

  handleRemove(ev) {
    ev.preventDefault()

    return this.props.removeComment(this.props.comment)
  }

  render() {
    if (!this.props.comment) return false

    return (
      <article className={this.props.className || 'nf-comments-comment'}>
        <h4 className="nf-comments-comment__header">{this.props.comment.author} said:</h4>
        <p className="nf-comments-comment__content">{this.props.comment.content}</p>
        <button type="button" className="nf-comments-comment__remove-button" onClick={this.boundHandleRemove}>
          Remove
        </button>
      </article>
    )
  }
}
