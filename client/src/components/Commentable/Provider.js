import React from 'react'
import Comment from './state/Comment'
import Comments from './state/Comments'

// The context for the Provider
export const CommentableContext = React.createContext('commentable')

// A mock id generator
let commentIdProg = 10

function getCommentId() {
  return commentIdProg++
}

export class CommentableProvider extends React.Component {
  constructor(props) {
    super(props)
    this.commentsTextBlock = []
    this.logger = this.props.logger || console

    this.comments = new Comments()

    this.state = {
      logger: this.logger,

      // The current comments displayed
      showCommentsForTextBlock: null,

      // Return the list of commend for a specific block
      getBlockComments: this.comments.getBlockComments.bind(this.comments),

      // Manage a reference the TextBlock connected to this provider
      // This reference is not currently used, if is still not used in the next steps it can be removed
      addTextBlock: this.handleAddTextBlock.bind(this),
      removeTextBlock: this.handleRemoveTextBlock.bind(this),

      // The UI events
      textBlockDoubleClick: this.handleTextBlockDoubleClick.bind(this),
      textBlockMouseEnter: this.handleTextBlockMouseEnter.bind(this),
      textBlockMouseLeave: this.handleTextBlockMouseLeave.bind(this),
      commentIconClick: this.handleCommentIconClick.bind(this)
    }

    this.handleAddNewComment = this.handleAddNewComment.bind(this)
    this.handleAddNewCommentCancel = this.handleAddNewCommentCancel.bind(this)
  }

  addComment(idBlock, message) {
    this.comments.addComment(
      new Comment(getCommentId(), { block: idBlock }, message, 'Davide')
    )
    // Required to propagate the update, search for a better solution
    this.setState({})
  }

  hasComment(id) {
    return !!this.comments.find(currentComment => currentComment.id === id)
  }

  handleAddNewComment(comment, reference) {
    window.getSelection().removeAllRanges()
    this.comments.addComment(
      new Comment(getCommentId(), reference, comment, 'Davide')
    )
    this.setState({
      showNewCommentPopUp: false,
      newCommentPopUpX: 0,
      newCommentPopUpY: 0,
      contextMenuCustomValues: null
    })
  }

  handleAddNewCommentCancel() {
    window.getSelection().removeAllRanges()

    this.setState({
      showNewCommentPopUp: false,
      newCommentPopUpX: 0,
      newCommentPopUpY: 0,
      contextMenuCustomValues: null
    })
  }

  handleCommentIconClick(event, commentId) {
    this.logger.info('[CommentableProvider:handleCommentIconClick]', commentId)
    this.setState({
      showCommentsForTextBlock:
        this.state.showCommentsForTextBlock === commentId ? null : commentId
    })
  }

  handleTextBlockMouseEnter(event, textBlockId) {
    this.logger.info('[CommentableProvider:handleMouseEnter]', textBlockId)
  }

  handleTextBlockMouseLeave(event, textBlockId) {
    this.logger.info('[CommentableProvider:handleMouseLeave]', textBlockId)
  }

  handleTextBlockDoubleClick(event, textBlockId) {
    this.logger.info('[CommentableProvider:handleDoubleClick]', textBlockId)

    this.setState({
      showNewCommentPopUp: true,
      newCommentPopUpX: event.pageX + 30,
      newCommentPopUpY: event.pageY - 20,
      contextMenuCustomValues: { block: textBlockId },
      addNewComment: this.handleAddNewComment,
      addNewCommentCancel: this.handleAddNewCommentCancel
    })
  }

  /**
   * Add a TextBlock to the provider
   * @param textBlock
   */
  handleAddTextBlock(textBlock) {
    if (
      this.commentsTextBlock.find(
        currentTextBlock => currentTextBlock.blockId === textBlock.blockId
      )
    ) {
      this.logger.warn(
        '[CommentableProvider:handleAddTextBlock]',
        `The textBlock with blockId =  '${textBlock.blockId}' already exists`
      )
      return
    }

    this.commentsTextBlock.push(textBlock)
  }

  /**
   * Remove a block from this provider
   * @param textBlock
   */
  handleRemoveTextBlock(textBlock) {
    const index = this.commentsTextBlock.findIndex(
      currentTextBlock => currentTextBlock.blockId === textBlock.blockId
    )
    this.commentsTextBlock = [
      ...this.commentsTextBlock.slice(0, index),
      ...this.commentsTextBlock.slice(index + 1)
    ]
  }

  render() {
    return (
      <CommentableContext.Provider value={this.state}>
        {this.props.children}
      </CommentableContext.Provider>
    )
  }
}
