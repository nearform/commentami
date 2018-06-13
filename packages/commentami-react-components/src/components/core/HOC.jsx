import PropTypes from 'prop-types'
import React from 'react'
import warning from 'warning'
import {
  commentsCount,
  fetchError,
  initError,
  isFetching,
  isInit,
  isUpdating,
  selectCommentsByReference,
  updateError
} from '../../state/selectors'
import { ResourceContext } from './Resource'

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

export function withResource(Component) {
  class withResource extends React.Component {
    get hasCommentable() {
      // This check works since the consumer will provide the context default value, which is 'commentable'
      return this.commentable && this.commentable !== 'commentable'
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
        commentami: {
          commentable: this.commentable,
          resource: (this.commentable || {}).resource,
          isInit: this.isInit,
          isFetching: this.isFetching,
          isUpdating: this.isUpdating,
          initError: this.initError,
          fetchError: this.fetchError,
          updateError: this.updateError
        }
      }

      return { ...additionalProps, ...this.props }
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

  withResource.displayName = `withResource(${Component.displayName || Component.name})`
  withResource.propTypes = {
    reference: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ])
  }

  return withResource
}

export function withReference(Component) {
  class WithReference extends React.Component {
    get hasCommentable() {
      // This check works since the consumer will provide the context default value, which is 'commentable'
      return this.props.commentami.commentable && this.props.commentami.commentable !== 'commentable'
    }

    get hasComments() {
      return (
        this.hasCommentable &&
        this.props.reference &&
        !!commentsCount(this.props.commentami.commentable, this.props.reference)
      )
    }

    _checkProps() {
      warning(this.props.reference, `The commentable block component should have a reference prop`)
    }

    componentDidMount() {
      this._checkProps()
    }

    componentDidUpdate() {
      this._checkProps()
    }

    addComment(reference, content) {
      return this.props.commentami.commentable.addComment(reference, content)
    }

    removeComment(comment) {
      return this.props.commentami.commentable.removeComment(comment)
    }

    listReferenceComments() {
      return selectCommentsByReference(this.props.commentami.commentable, this.props.reference)
    }

    render() {
      const props = { ...this.props }
      const parentCommentami = props.commentami
      delete props.commentami
      const commentami = {
        ...parentCommentami,
        reference: this.props.reference,
        hasComments: this.hasComments,
        addComment: this.addComment.bind(this),
        removeComment: this.removeComment.bind(this),
        listReferenceComments: this.listReferenceComments.bind(this)
      }

      return <Component {...this.props} commentami={commentami} />
    }
  }

  WithReference.displayName = `WithReference(${Component.displayName || Component.name})`

  WithReference.propTypes = {
    commentami: PropTypes.shape({
      commentable: PropTypes.shape({
        addComment: PropTypes.func.isRequired,
        removeComment: PropTypes.func.isRequired
      }).isRequired
    }),

    reference: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ]).isRequired
  }

  return withResource(WithReference)
}
