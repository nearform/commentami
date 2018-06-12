import React from 'react'
import warning from 'warning'

import {
  commentsCount,
  isInit,
  isFetching,
  isUpdating,
  initError,
  fetchError,
  updateError
} from '../../state/selectors'
import { ResourceContext } from './Resource'
import PropTypes from 'prop-types'

export function flexibleRender({ render, component: Component, children }, renderProps, defaultComponent) {
  if (!Component) Component = defaultComponent

  // render prop takes precedence over component prop - Last resource is to just render components
  if (typeof render === 'function') {
    return render(renderProps)
  } else if (Component) {
    return <Component {...renderProps} />
  } else {
    return children
  }
}

export function withComments(Component) {
  class WithComments extends React.Component {
    get hasCommentable() {
      // This check works since the consumer will provide the context default value, which is 'commentable'
      return this.commentable && this.commentable !== 'commentable'
    }

    get hasComments() {
      return this.hasCommentable && this.props.reference && !!commentsCount(this.commentable, this.props.reference)
    }

    get isInit() {
      return this.hasCommentable && isInit(this.commentable)
    }

    get isFetching() {
      return this.hasCommentable && isFetching(this.commentable)
    }

    get isUpdating() {
      return this.hasCommentable && isUpdating(this.commentable)
    }

    get initError() {
      return this.hasCommentable && initError(this.commentable)
    }

    get fetchError() {
      return this.hasCommentable && fetchError(this.commentable)
    }

    get updateError() {
      return this.hasCommentable && updateError(this.commentable)
    }

    _checkProps() {
      warning(this.hasCommentable, `The commentable component should be inside a Resource`)
    }

    _renderInner(commentable) {
      this.commentable = commentable

      return <Component {...this._renderProps()} />
    }

    _renderProps() {
      const additionalProps = {
        commentable: this.commentable,
        resource: (this.commentable || {}).resource,
        hasComments: this.hasComments,
        isInit: this.isInit,
        isFetching: this.isFetching,
        isUpdating: this.isUpdating,
        initError: this.initError,
        fetchError: this.fetchError,
        updateError: this.updateError
      }
      const callbacks = {
        addComment: this.addComment.bind(this),
        removeComment: this.removeComment.bind(this)
      }

      return { ...additionalProps, ...callbacks, ...this.props }
    }

    addComment(reference, content) {
      return this.commentable.addComment(reference, content)
    }

    removeComment(comment) {
      return this.commentable.removeComment(comment)
    }

    componentDidMount() {
      this._checkProps()
    }

    componentDidUpdate() {
      this._checkProps()
    }

    render() {
      return <ResourceContext.Consumer>{commentable => this._renderInner(commentable)}</ResourceContext.Consumer>
    }
  }

  WithComments.displayName = `WithComments(${Component.displayName || Component.name})`
  WithComments.propTypes = {
    reference: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ])
  }

  return WithComments
}

export function withReference(Component) {
  class WithReference extends React.Component {
    // TODO@PI: Make sure the reference is unique within the provider
    _checkProps() {
      warning(this.props.reference, `The commentable block component should have a reference prop`)
    }

    componentDidMount() {
      this._checkProps()
    }

    componentDidUpdate() {
      this._checkProps()
    }

    render() {
      return <Component {...this.props} />
    }
  }

  WithReference.displayName = `WithReference(${Component.displayName || Component.name})`

  WithReference.propTypes = {
    reference: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ]).isRequired
  }

  return withComments(WithReference)
}
