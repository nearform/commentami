import PropTypes from 'prop-types'
import React from 'react'
import { commentamiDeeplinkPropType, commentPropInterface } from '../../core/propInterfaces'
import { withDeepLink } from '../DeepLinkController'

export class DefaultCommentBase extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isHighlighted: false
    }
    this.rootRef = React.createRef()

    this.highlightTimeout = null
    this.boundHandleRemove = this.handleRemove.bind(this)
  }

  handleRemove(ev) {
    ev.preventDefault()

    return this.props.removeComment(this.props.comment)
  }

  componentDidMount() {
    if (
      this.props.commentamiDeeplink &&
      this.props.commentamiDeeplink.hasDeepLink &&
      String(this.props.commentamiDeeplink.comment) === String(this.props.comment.id)
    ) {
      this.props.commentamiDeeplink.scrollIntoView(this.rootRef.current)
      this.setState({
        isHighlighted: true
      })
      this.props.commentamiDeeplink.unsetDeepLink()
      this.highlightTimeout = setTimeout(() => {
        this.highlightTimeout = null

        this.setState({
          isHighlighted: false
        })
      }, 1000)
    }
  }

  componentWillUnmount() {
    this.highlightTimeout && clearTimeout(this.highlightTimeout)
  }

  renderAuthor(author) {
    if (typeof author !== 'object') {
      return <h5>{author} said</h5>
    }

    return (
      <a href={author.profileUrl} target="_blank">
        <div>
          <img src={author.avatarUrl} />
          <div>
            {author.firstName} {author.lastName.charAt(0)}.
          </div>
        </div>
      </a>
    )
  }

  render() {
    if (!this.props.comment) return false

    const className = this.props.className

    return (
      <article className={className} ref={this.rootRef}>
        {this.renderAuthor(this.props.comment.author)}
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

DefaultCommentBase.displayName = 'DefaultComment'

DefaultCommentBase.defaultProps = {
  className: 'nf-commentami-comment'
}

DefaultCommentBase.propTypes = {
  commentamiDeeplink: PropTypes.oneOfType([PropTypes.shape(commentamiDeeplinkPropType), PropTypes.string]),
  comment: PropTypes.shape(commentPropInterface),
  className: PropTypes.string,
  removeComment: PropTypes.func.isRequired
}

export const DefaultComment = withDeepLink(DefaultCommentBase)
