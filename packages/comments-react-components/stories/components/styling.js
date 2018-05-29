import { style, cssRule } from 'typestyle'

cssRule('#comments-sidebar-container', {
  position: 'fixed',
  right: 0,
  top: 0
})

cssRule('.comments-marker', {
  position: 'absolute',
  top: 0,
  left: `-22px`
})

export const sidebarClassName = style({
  backgroundColor: '#E0E0E0',
  borderLeft: '2px solid #808080',
  zIndex: 10,
  padding: '15px',
  height: '100vh',
  $nest: {
    '[data-role=form]': {
      display: 'grid',
      gridTemplateRows: 'auto 75px auto',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: '5px',
      justifyContent: 'flex-end'
    },
    '[data-role=form] h2, [data-role=form] textarea': {
      gridColumn: '1 / span 3'
    },
    '[data-role=form] button:first-of-type': {
      gridColumn: '2 / 3',
      height: '30px'
    },
    '[data-role=comments] > div': {
      margin: 0,
      padding: '0 0 0 20px'
    },
    '[data-role=close]': {
      position: 'absolute',
      top: '15px',
      right: '15px'
    }
  }
})

export const highlightedReferenceClassName = style({
  backgroundColor: '#e3ead4'
})
