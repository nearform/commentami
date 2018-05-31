import React from 'react'

// Icon from https://www.brandeps.com/icon/
const icons = {
  comment:
    'M77.1,24.7c0-3.2-2.6-5.8-5.8-5.8H24.7c-3.2,0-5.8,2.6-5.8,5.8v35c0,3.2,2.6,5.8,5.8,5.8h40.8 l11.7,11.7L77.1,24.7z M65.5,53.8h-35V48h35V53.8z M65.5,45.1h-35v-5.8h35V45.1z M65.5,36.3h-35v-5.8h35V36.3z',
  close:
    'M48,16.3c-17.5,0-31.7,14.2-31.7,31.7S30.5,79.7,48,79.7S79.7,65.5,79.7,48S65.5,16.3,48,16.3z M63.8,59.4l-4.5,4.5L48,52.5L36.6,63.8l-4.5-4.5L43.5,48L32.2,36.6l4.5-4.5L48,43.5l11.4-11.4l4.5,4.5L52.5,48L63.8,59.4z'
}

export function isValidSize(size) {
  return typeof size === 'number' && !isNaN(size) && size > 0
}

export function CommentableIcon({ className, color: fill, width, height, id }) {
  width = isValidSize(width) ? width : CommentableIcon.defaultSize
  height = isValidSize(height) ? height : width
  if (!fill) fill = CommentableIcon.defaultColor

  return (
    <svg version="1.1" viewBox="0 0 96 96" className={className} width={!className ? width : null} height={!className ? height : null}>
      <g>
        <path style={!className ? { fill } : {}} d={icons[id]} />
      </g>
    </svg>
  )
}

CommentableIcon.defaultSize = 22
CommentableIcon.defaultColor = '#666'
