import { rem } from 'csx'
import { style } from 'typestyle'

export function debugClassName($debugName, force) {
  try {
    return (typeof force !== 'undefined' && !force) || process.env.NODE_ENV === 'production' ? {} : { $debugName }
  } catch (e) {
    return { $debugName }
  }
}

export const mainClassName = style(debugClassName('main'), {
  display: 'grid',
  flex: 1,
  gridTemplateRows: 'min-content 1fr',
  $nest: {
    '& > :first-child:last-child': { gridRow: '2' } // This is to center the spinner while loading
  }
})

export const CommentableBlockClassName = style(debugClassName('CommentableBlock'), {
  $nest: {
    '&:hover': {
      backgroundColor: '#FFF9C4',
      color: 'black'
    }
  }
})

export const highlightedCommentableBlockClassName = style(debugClassName('CommentableBlock'), {
  backgroundColor: '#FDD835',
  color: 'black'
})

export const markerClassName = style(debugClassName('CommentableBlock'), {
  position: 'absolute',
  top: 0,
  left: rem(-7.3), // 48px is the size of the icon, 2.5rem=25px is to put "outside" the page
  cursor: 'pointer',
  $nest: {
    svg: {
      width: rem(4.8),
      height: rem(4.8),
      fill: 'yellow'
    }
  }
})
