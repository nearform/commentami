import { rem, em, viewWidth, viewHeight } from 'csx'
import { debugClassName } from './environment'
import { style, cssRule } from 'typestyle'

cssRule('#comments-sidebar-container', {
  position: 'fixed',
  right: 0,
  top: 0
})

export const sidebarClassName = style(debugClassName('sidebar'), {
  backgroundColor: '#F0F0F0',
  borderLeft: `${rem(0.2)} solid #808080`,
  zIndex: 10,
  padding: rem(1.5),
  width: rem(40),
  maxWidth: viewWidth(75),
  height: viewHeight(100),
  $nest: {
    '[data-role=form]': {
      display: 'grid',
      gridTemplateRows: `auto ${rem(8)} auto`,
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: rem(0.5),
      justifyContent: 'flex-end'
    },
    '[data-role=form] h2, [data-role=form] textarea': {
      gridColumn: '1 / span 3'
    },
    '[data-role=form] textarea': {
      border: `${rem(0.1)} solid #E0E0E0`,
      padding: rem(0.5)
    },
    '[data-role=form] button': {
      border: `${rem(0.1)} solid #E0E0E0`,
      padding: `${rem(1)} ${rem(2)}`,
      whiteSpace: 'nowrap',
      fontWeight: 'bold',
      fontSize: em(0.8),
      cursor: 'pointer'
    },
    '[data-role=form] button:first-of-type': {
      gridColumn: '2 / 3',
      backgroundColor: '#F0F0F0'
    },
    '[data-role=form] button:first-of-type:hover': {
      backgroundColor: '#E8E8E8'
    },
    '[data-role=form] button:last-of-type': {
      backgroundColor: '#DA3338',
      color: 'white'
    },
    '[data-role=form] button:last-of-type:hover': {
      backgroundColor: '#CC0000'
    },
    '[data-role=comments]': {
      marginTop: rem(2)
    },
    '[data-role=comments] > div': {
      margin: `${rem(1)} 0 0 0`,
      border: `${rem(0.1)} solid #E0E0E0`,
      backgroundColor: 'white',
      padding: rem(1)
    },
    '[data-role=comments] p': {
      marginBottom: rem(0)
    },
    '[data-role=close]': {
      position: 'absolute',
      top: rem(1.5),
      right: rem(1.5)
    }
  }
})
