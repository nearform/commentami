import React from 'react'
import { commentable } from '../core/CommentableComponents'

const defaultLabels = {
  title: 'Add new comment',
  placeholder: 'Enter some text ...',
  cancelLabel: 'Cancel',
  submitLabel: 'Add'
}

export class NewCommentFormBase extends React.Component {
  constructor(props) {
    super(props)

    this.textareaRef = React.createRef()
    this.boundHandleSubmit = this.handleSubmit.bind(this)
    this.boundHandleReset = this.handleReset.bind(this)
    this.boundHandleKeyPress = this.handleKeyPress.bind(this)
  }

  handleSubmit(ev) {
    ev.preventDefault()
    const value = (this.textareaRef.current.value || '').trim()

    if (value) this.props.addComment(this.props.reference, value)
    this.textareaRef.current.value = ''
  }

  handleReset(ev) {
    ev.preventDefault()

    this.textareaRef.current.value = ''
  }

  handleKeyPress(ev) {
    if (ev.key.toLowerCase() === 'enter' && !ev.shiftKey) setTimeout(() => this.handleSubmit(ev), 5)
  }

  render() {
    const { title, placeholder, cancelLabel, submitLabel, className } = Object.assign(defaultLabels, this.props)

    return (
      <form action="#" className={className || 'nf-comments-new-form'}>
        {title && <h2 className="nf-comments-new-form__title">{title}</h2>}
        <textarea
          ref={this.textareaRef}
          className="nf-comments-new-form__textarea"
          placeholder={placeholder}
          onKeyPress={this.boundHandleKeyPress}
        />
        <button
          type="reset"
          className="nf-comments-new-form__button nf-comments-new-form__button--secondary"
          onClick={this.boundHandleReset}
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          className="nf-comments-new-form__button nf-comments-new-form__button--primary"
          onClick={this.boundHandleSubmit}
        >
          {submitLabel}
        </button>
      </form>
    )
  }
}

export const NewCommentForm = commentable(NewCommentFormBase)
