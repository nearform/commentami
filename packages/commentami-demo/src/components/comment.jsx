import React from 'react'
import { rem } from 'csx'
import { style } from 'typestyle'
import { Icon } from './icon'
import { withDeepLink } from '@nearform/commentami-react-components/dist/ui'

const commentClassName = style({
  margin: `${rem(1)} 0 0 0`,
  border: `${rem(0.1)} solid #E0E0E0`,
  backgroundColor: 'white',
  transition: 'background-color 5s ease',
  padding: rem(1),
  $nest: {
    p: {
      marginBottom: 0
    }
  }
})

const commentHighlightClassName = style({
  backgroundColor: '#d4eede',
  transition: 'background-color 0.5s ease'
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

const authorLinkClass = style({
  display: 'flex'
})

const authorLinkImageClass = style({
  display: 'block',
  marginRight: '8px',
  width: '25px',
  height: '25px'
})

export class CommentBase extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isHighlighted: false
    }
    this.rootRef = React.createRef()

    this.boundHandleRemove = this.handleRemove.bind(this)
  }

  handleRemove(ev) {
    ev.preventDefault()

    return this.props.removeComment(this.props.comment)
  }

  componentDidMount() {
    if (this.props.commentamiDeeplink) {
      if (
        this.props.commentamiDeeplink.hasDeepLink &&
        String(this.props.commentamiDeeplink.comment) === String(this.props.comment.id)
      ) {
        if (this.rootRef.current) {
          this.rootRef.current.scrollIntoView()
        }
        this.setState({
          isHighlighted: true
        })
        setTimeout(() => this.props.commentamiDeeplink.unsetDeepLink())
        setTimeout(
          () =>
            this.setState({
              isHighlighted: false
            }),
          1000
        )
      }
    }
  }

  renderAuthor(author) {
    if (typeof author !== 'object') {
      return <h5>{author} said</h5>
    }

    return (
      <a href={author.profileUrl} target="_blank">
        <div className={authorLinkClass}>
          <img className={authorLinkImageClass} src={author.avatarUrl} />
          <div>
            {author.firstName} {author.lastName.charAt(0)}.
          </div>
        </div>
      </a>
    )
  }

  renderCommentContent(comment) {
    if (!comment.mentions || comment.mentions.length === 0) {
      return <p>{this.props.comment.content}</p>
    }

    let body = comment.content
    comment.mentions.forEach(mention => {
      if (typeof mention === 'string') {
        let re = new RegExp('^@' + mention + '|\\s@' + mention, 'g')
        body = body.replace(re, ` <b>@${mention}</b>`)
        return
      }

      if (typeof mention === 'object') {
        let re = new RegExp('^@' + mention.username + '|\\s@' + mention.username, 'g')
        body = body.replace(re, ` <b>@${mention.username}</b>`)
      }
    })

    return <p dangerouslySetInnerHTML={{ __html: body.trim() }} />
  }

  render() {
    return (
      <article
        className={`${commentClassName} ${this.state.isHighlighted ? commentHighlightClassName : ''}`}
        ref={this.rootRef}
      >
        <header className={commentHeaderClassName}>
          {this.renderAuthor(this.props.comment.author)}
          <a href="#" onClick={this.boundHandleRemove}>
            <Icon name="trash" className={removeIconClassName} />
          </a>
        </header>

        {this.renderCommentContent(this.props.comment)}
      </article>
    )
  }
}

export const Comment = withDeepLink(CommentBase)
