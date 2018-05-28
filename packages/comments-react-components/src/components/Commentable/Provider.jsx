import React from 'react'
import { Comments } from './state/Comments'

// The context for the Provider
export const CommentableContext = React.createContext('commentable')

export class CommentableProvider extends React.Component {
  constructor(props) {
    super(props)
    this.commentsTextBlock = []
    this.logger = this.props.logger || console

    this.comments = new Comments(this.props.service)

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
      commentIconClick: this.handleCommentIconClick.bind(this),

      // The comment action hooks
      addNewComment: this.handleAddNewComment.bind(this),
      addNewCommentCancel: this.handleAddNewCommentCancel.bind(this),

      currentCommentUrl: null
    }
  }

  /**
   * Get the url to use as a index in the comments
   * @returns {string}
   */
  getCurrentCommentUrl() {
    // TODO get the url from the browser or if defined from a props set in the provider
    return 'url1'
  }

  async handleAddNewComment(comment, customVariables) {
    window.getSelection().removeAllRanges()
    try {
      await this.comments.addComment({
        url: this.getCurrentCommentUrl(),
        reference: customVariables.reference,
        content: comment
      })
      this.setState({
        showNewCommentPopUp: false,
        newCommentPopUpX: 0,
        newCommentPopUpY: 0,
        contextMenuCustomValues: null
      })
    } catch (e) {
      this.logger.error(e)
    }
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

  // Mouse events handlers
  handleCommentIconClick(event, commentId) {
    this.logger.info('[CommentableProvider:handleCommentIconClick]', commentId)
    this.setState({
      showCommentsForTextBlock: this.state.showCommentsForTextBlock === commentId ? null : commentId
    })
  }

  handleTextBlockMouseEnter(event, reference) {
    this.logger.info('[CommentableProvider:handleMouseEnter]', reference)
  }

  handleTextBlockMouseLeave(event, reference) {
    this.logger.info('[CommentableProvider:handleMouseLeave]', reference)
  }

  handleTextBlockDoubleClick(event, reference) {
    this.logger.info('[CommentableProvider:handleDoubleClick]', reference)

    this.setState({
      showNewCommentPopUp: true,
      newCommentPopUpX: event.pageX + 30,
      newCommentPopUpY: event.pageY - 20,
      contextMenuCustomValues: { reference }
    })
  }

  /**
   * Add a TextBlock to the provider
   * Is currently used only to check id a block with the same ID exists
   * @param textBlock
   */
  handleAddTextBlock(textBlock) {
    if (this.commentsTextBlock.find(currentTextBlock => currentTextBlock.blockId === textBlock.blockId)) {
      this.logger.warn('[CommentableProvider:handleAddTextBlock]', `The textBlock with blockId =  '${textBlock.blockId}' already exists`)
      return
    }

    this.commentsTextBlock.push(textBlock)
  }

  /**
   * Remove a block from this provider
   * @param textBlock
   */
  handleRemoveTextBlock(textBlock) {
    const index = this.commentsTextBlock.findIndex(currentTextBlock => currentTextBlock.blockId === textBlock.blockId)
    this.commentsTextBlock = [...this.commentsTextBlock.slice(0, index), ...this.commentsTextBlock.slice(index + 1)]
  }

  async refreshCommentList() {
    try {
      await this.comments.refresh(this.getCurrentCommentUrl())
      this.setState({ currentCommentUrl: this.getCurrentCommentUrl() })
    } catch (e) {
      this.logger.error(e)
    }
  }

  componentDidMount() {
    this.refreshCommentList()
  }

  componentDidUpdate() {
    if (this.getCurrentCommentUrl() !== this.state.currentCommentUrl) {
      this.refreshCommentList()
    }
  }

  render() {
    return <CommentableContext.Provider value={this.state}>{this.props.children}</CommentableContext.Provider>
  }
}
