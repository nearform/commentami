import React from 'react'
import warning from 'warning'
import { CommentableContext } from '../core/CommentableProvider'

export class CommentableComponent extends React.Component {
  get hasCommentable() {
    // This check works since the consumer will provide the context default value, which is 'commentable'
    return this.commentable && this.commentable !== 'commentable'
  }

  get renderProps() {
    return {}
  }

  addComment(reference, content) {
    this.commentable.addComment(reference, content)
  }

  removeComment(comment) {
    this.commentable.removeComment(comment)
  }

  componentDidMount() {
    warning(this.hasCommentable, `The ${this.constructor.name} component should be inside a CommentableProvider`)
  }

  render() {
    return <CommentableContext.Consumer>{commentable => this._renderInner(commentable)}</CommentableContext.Consumer>
  }

  renderCommentable() {
    return this.props.children
  }

  _renderInner(commentable) {
    this.commentable = commentable
    const { render, component: Component, children } = this.props
    const renderProps = Object.assign({ commentable, resource: commentable.resource, children }, this.renderProps)

    // render prop takes precedence over component prop - Last resource is to just render components
    if (render) {
      return this.props.render(renderProps)
    } else if (Component) {
      return <Component commentable={commentable} {...renderProps} />
    } else {
      return this.renderCommentable()
    }
  }
}
