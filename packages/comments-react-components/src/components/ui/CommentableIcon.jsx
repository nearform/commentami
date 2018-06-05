import React from 'react'

export function isValidSize(size) {
  return typeof size === 'number' && !isNaN(size) && size > 0
}

export function CommentableIcon({ path, width, height, viewBox, className }) {
  width = isValidSize(width) ? width : CommentableIcon.defaultSize
  height = isValidSize(height) ? height : width

  return (
    <svg
      version="1.1"
      viewBox={viewBox || `0 0 ${width} ${height}`}
      className={className || 'nf-comments-icon'}
      width={!className ? width : null}
      height={!className ? height : null}
    >
      <g>
        <path d={path} />
      </g>
    </svg>
  )
}

CommentableIcon.defaultSize = 24
