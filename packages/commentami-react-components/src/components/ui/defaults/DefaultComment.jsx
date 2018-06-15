import PropTypes from 'prop-types'
import React from 'react'
import { commentPropInterface } from '../../core/propInterfaces'

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

    const className = this.props.className

    return (
      <article className={className}>
        <h4 className={`${className}__header`}>{this.props.comment.author} said:</h4>
        <p className={`${className}__content`}>{this.props.comment.content}</p>
        {typeof this.props.removeComment === 'function' && (
          <button type="button" className={`${className}__remove-button`} onClick={this.boundHandleRemove}>
            Remove
          </button>
        )}
      </article>
    )
  }
}

DefaultComment.displayName = 'DefaultComment'

DefaultComment.defaultProps = {
  className: 'nf-commentami-comment'
}

DefaultComment.propTypes = {
  comment: PropTypes.shape(commentPropInterface),
  className: PropTypes.string,
  removeComment: PropTypes.func.isRequired
}
