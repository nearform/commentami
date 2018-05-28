import React from 'react'
import warning from 'warning'
import { CommentableContext } from './Provider'

const styles = {
  wrapper: {
    position: 'absolute',
    width: '300px',
    padding: '10px',
    border: '1px solid black',
    backgroundColor: '#c9ccb3',
    zIndex: 100
  },
  button: {
    width: '100%',
    height: '30px',
    marginTop: '5px',
    marginBottom: '5px'
  },
  textarea: {
    width: '293px',
    height: '120px'
  }
}

export class NewCommentPopUpElement extends React.Component {
  constructor(props) {
    super(props)

    this.textareaRef = React.createRef()

    this.handleAddNewComment = this.handleAddNewComment.bind(this)
    this.addNewCommentCancel = this.addNewCommentCancel.bind(this)
  }

  handleAddNewComment() {
    if (!(this.textareaRef.current.value || '').trim()) {
      return this.props.commentable.addNewCommentCancel()
    }
    this.props.commentable.addNewComment(
      this.textareaRef.current.value,
      this.props.commentable.contextMenuCustomValues
    )
    this.textareaRef.current.value = ''
  }

  addNewCommentCancel() {
    this.props.commentable.addNewCommentCancel()
  }

  componentDidMount() {
    warning(
      this.props.commentable !== 'commentable',
      'The NewCommentPopUp component should be inside a CommentableProvider'
    )
  }

  hasCommentable() {
    return this.props.commentable && this.props.commentable !== 'commentable'
  }

  render() {
    if (!this.hasCommentable()) {
      return false
    }
    const {
      newCommentPopUpX,
      newCommentPopUpY,
      showNewCommentPopUp
    } = this.props.commentable

    if (!showNewCommentPopUp) {
      return false
    }

    return (
      <div
        style={Object.assign({}, styles.wrapper, {
          top: `${newCommentPopUpY}px`,
          left: `${newCommentPopUpX}px`
        })}
      >
        <div>
          <textarea style={styles.textarea} ref={this.textareaRef} />
        </div>
        <div>
          <button style={styles.button} onClick={this.handleAddNewComment}>
            Add a comment
          </button>
        </div>
        <div>
          <button style={styles.button} onClick={this.addNewCommentCancel}>
            Cancel
          </button>
        </div>
      </div>
    )
  }
}

export class NewCommentPopUp extends React.Component {
  render() {
    return (
      <CommentableContext.Consumer>
        {commentable => (
          <NewCommentPopUpElement {...this.props} commentable={commentable}>
            {this.props.children}
          </NewCommentPopUpElement>
        )}
      </CommentableContext.Consumer>
    )
  }
}
