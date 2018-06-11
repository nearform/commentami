import React from 'react'
import PropTypes from 'prop-types'

export function isValidSize(size) {
  return typeof size === 'number' && !isNaN(size) && size > 0
}

export function Icon({ path, width, height, viewBox, className, size }) {
  width = isValidSize(width) ? width : size
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

Icon.displayName = 'Icon'

Icon.defaultProps = {
  size: 24
}

Icon.propTypes = {
  path: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  size: PropTypes.number,
  viewBox: PropTypes.string,
  className: PropTypes.string
}
