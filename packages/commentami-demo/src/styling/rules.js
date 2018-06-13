import { em, px, viewHeight, viewWidth } from 'csx'
import { cssRule } from 'typestyle'

cssRule('.nf-comments-block', {
  position: 'relative',
  $nest: {
    '&:hover': {
      backgroundColor: '#FFF9C4',
      color: 'black'
    },
    '&--active': {
      backgroundColor: '#FDD835',
      color: 'black'
    }
  }
})

cssRule('.nf-comments-marker', {
  position: 'absolute',
  top: 0,
  left: px(-54), // 24px is the size of the icon, 3rem=30px is to put "outside" the page
  cursor: 'pointer'
})

cssRule('.nf-comments-sidebar', {
  backgroundColor: '#F0F0F0',
  borderLeft: `${px(2)} solid #808080`,
  zIndex: 10,
  padding: px(15),
  width: px(300),
  maxWidth: viewWidth(75),
  height: viewHeight(100),
  position: 'fixed',
  top: 0,
  right: 0,
  $nest: {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }
})

cssRule('.nf-comments-sidebar__close', {
  display: 'inline-block',
  height: px(24),
  $nest: {
    svg: {
      fill: '#666'
    }
  }
})

cssRule('.nf-comments-comment', {
  margin: `${px(10)} 0 0 0`,
  border: `${px(1)} solid #E0E0E0`,
  backgroundColor: 'white',
  padding: px(10),
  display: 'flex',
  flexDirection: 'column',
  $nest: {
    p: {
      marginBottom: 0
    },
    button: {
      border: `${px(1)} solid #E0E0E0`,
      padding: px(5),
      whiteSpace: 'nowrap',
      fontWeight: 'bold',
      fontSize: em(0.8),
      cursor: 'pointer',
      transition: '0.2s background-color ease',
      backgroundColor: '#F0F0F0',
      marginTop: px(10),
      $nest: {
        '&:hover': { backgroundColor: '#E8E8E8' }
      }
    }
  }
})

cssRule('.nf-comments-new-form', {
  display: 'grid',
  gridTemplate: `
  "title  title     title" min-content
  "text   text      text" min-content
  "null   secondary primary" min-content
  / 2fr 1fr 1fr
  `,
  gridGap: px(10),
  justifyContent: 'flex-end',
  paddingBottom: px(20),
  borderBottom: `${px(2)} solid #E0E0E0`
})

cssRule('.nf-comments-new-form__title', { gridArea: 'title' })

cssRule('.nf-comments-new-form__textarea', {
  gridArea: 'text',
  border: `${px(1)} solid #E0E0E0`,
  height: px(100),
  padding: px(5)
})

cssRule('.nf-comments-new-form__button', {
  border: `${px(1)} solid #E0E0E0`,
  padding: `${px(10)} ${px(20)}`,
  whiteSpace: 'nowrap',
  fontWeight: 'bold',
  fontSize: em(0.8),
  cursor: 'pointer',
  transition: '0.2s background-color ease',
  $nest: {
    '&--secondary': {
      gridArea: 'secondary',
      backgroundColor: '#F0F0F0',
      $nest: {
        '&:hover': { backgroundColor: '#E8E8E8' }
      }
    },
    '&--primary': {
      gridArea: 'primary',
      backgroundColor: '#DA3338',
      color: 'white',
      $nest: {
        '&:hover': { backgroundColor: '#CC0000' },
        '&[disabled]': {
          opacity: 0.5,
          pointerEvents: 'none',
          cursor: 'pointer'
        }
      }
    }
  }
})
