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
