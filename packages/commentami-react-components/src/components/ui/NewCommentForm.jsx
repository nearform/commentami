import PropTypes from 'prop-types'
import React from 'react'
import { withReference } from '../core/HOC'
import { commentamiReferencePropInterface, referencePropInterface } from '../core/propInterfaces'

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

    if (value) this.props.commentami.addComment(this.props.reference, value)
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
    const {
      commentami: { isUpdating },
      className,
      title,
      placeholder,
      cancelLabel,
      submitLabel,
      savingLabel
    } = this.props

    return (
      <form action="#" className={className}>
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
          disabled={isUpdating}
        >
          {isUpdating ? savingLabel : submitLabel}
        </button>
      </form>
    )
  }
}

NewCommentFormBase.displayName = 'NewCommentFormBase'

NewCommentFormBase.defaultProps = {
  className: 'nf-comments-new-form',
  title: 'Add new comment',
  placeholder: 'Enter some text ...',
  cancelLabel: 'Cancel',
  submitLabel: 'Add',
  savingLabel: 'Saving ...'
}

NewCommentFormBase.propTypes = {
  commentami: PropTypes.shape(commentamiReferencePropInterface).isRequired,
  reference: referencePropInterface.isRequired,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  cancelLabel: PropTypes.string,
  submitLabel: PropTypes.string,
  savingLabel: PropTypes.string,
  className: PropTypes.string
}

export const NewCommentForm = withReference(NewCommentFormBase)

NewCommentForm.displayName = 'NewCommentForm'
