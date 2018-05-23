import React from 'react'
import warning from 'warning'

import { CommentableTextBlockContext } from './TextBlock'

const CommentRightIcon = ({ color = '#666', width = '22', height = '22' }) => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      x="0px"
      y="0px"
      viewBox="0 0 96 96"
      style={{ enableBackground: 'new 0 0 96 96' }}
      width={width}
      height={height}
    >
      <g id="XMLID_7_">
        <path
          id="XMLID_13_"
          style={{ fill: color }}
          d="M77.1,24.7c0-3.2-2.6-5.8-5.8-5.8H24.7c-3.2,0-5.8,2.6-5.8,5.8v35c0,3.2,2.6,5.8,5.8,5.8h40.8
		l11.7,11.7L77.1,24.7z M65.5,53.8h-35V48h35V53.8z M65.5,45.1h-35v-5.8h35V45.1z M65.5,36.3h-35v-5.8h35V36.3z"
        />
      </g>
    </svg>
  )
}

class CommentableIconElement extends React.Component {
  constructor(props) {
    super(props)

    this.commentableId = this.props.commentableId
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
  }

  hasCommentableTextBlock() {
    return (
      this.props.commentableTextBlock &&
      this.props.commentableTextBlock !== 'commentableTextBlock'
    )
  }

  componentDidMount() {
    warning(
      this.hasCommentableTextBlock(),
      'The CommentableIcon component should be inside a CommentableTextBlock'
    )
  }

  showComment() {
    return (
      this.hasCommentableTextBlock() && this.props.commentableTextBlock.showIcon
    )
  }

  handleDoubleClick(e) {
    e.stopPropagation()
  }

  handleOnClick(e) {
    if (this.hasCommentableTextBlock()) {
      this.props.commentableTextBlock.onClick(e)
    }
  }

  render() {
    return (
      this.showComment() && (
        <span
          onDoubleClick={this.handleDoubleClick}
          onClick={this.handleOnClick}
        >
          {this.props.children || <CommentRightIcon />}
        </span>
      )
    )
  }
}

export class CommentableIcon extends React.Component {
  render() {
    return (
      <CommentableTextBlockContext.Consumer>
        {commentableTextBlock => (
          <CommentableIconElement
            {...this.props}
            commentableTextBlock={commentableTextBlock}
          >
            {this.props.children}
          </CommentableIconElement>
        )}
      </CommentableTextBlockContext.Consumer>
    )
  }
}
