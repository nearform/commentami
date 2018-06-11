import { em, px, rem } from 'csx'
import { cssRaw, cssRule as global, fontFace } from 'typestyle'

export const fontSize = '12pt'
export const linkColor = '#DA3338'
export const linkHighlightColor = '#CC0000'

/* eslint-disable max-len */
export const systemFontsStack = `
  -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Helvetica, Arial, sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
`.replace(/\s+/g, '')

cssRaw(
  '/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}template{display:none}[hidden]{display:none}/*# sourceMappingURL=normalize.min.css.map */'
)

fontFace({
  fontFamily: 'Lato',
  fontStyle: 'normal',
  fontWeight: 400,
  src:
    'local("Lato Light"), local("Lato-Light"), url(https://fonts.gstatic.com/s/lato/v11/kU6VHbqMAZhaN_nXCmLQsQ.woff) format("woff")',
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000'
})

fontFace({
  fontFamily: 'Lato',
  fontStyle: 'normal',
  fontWeight: 700,
  src:
    'local("Lato Bold"), local("Lato-Bold"), url(https://fonts.gstatic.com/s/lato/v11/I1Pn3gihk5vyP0Yw5GqKsQ.woff) format("woff")',
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000'
})

global('html', { fontSize: px(10) }) // This sets 1rem = 10px

global('*, *:hover, *:focus, *:active, *:before, *::after', {
  boxSizing: 'border-box',
  outline: 'none'
})

global('body', {
  fontSize,
  fontWeight: 400,
  minHeight: '100vh',
  backgroundColor: '#E0E0E0'
})

global('body, a, p, strong, em, li, dd, dt, button, input, select, textarea, h1, h2, h3, h4, h5, h6', {
  margin: 0,
  lineHeight: 1.4,
  fontFamily: `Lato, ${systemFontsStack}`
})

global('h1', { fontSize: em(2) })
global('h2', { fontSize: em(1.7) })
global('h3', { fontSize: em(1.4) })
global('h4', { fontSize: em(1.2) })
global('h5, h6', { fontSize: em(1) })

global('p', { margin: `${em(1)} 0` })

global('a', {
  textDecoration: 'none',
  transition: 'color 0.2s ease'
})

global('a, a:focus, a:active', { color: linkColor })
global('a:hover', { color: linkHighlightColor })

global('strong', { fontWeight: 'bold' })

global('ul, ol', { paddingLeft: rem(1.7) })
global('ul.unstyled, ol.unstyled', {
  listStyle: 'none',
  margin: 0,
  paddingLeft: 0
})

global('dl', { margin: 0 })
global('dt', { fontWeight: 'bold' })
global('dt:nth-child(n + 1)', { marginTop: rem(1) })
global('dl', { margin: '0' })
