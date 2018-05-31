import { rem, viewWidth } from 'csx'
import React from 'react'
import { Link } from 'react-router-dom'
import { style } from 'typestyle'
import { debugClassName } from '../styling/environment'

export const pageClassName = style(debugClassName('page'), {
  width: `calc(${viewWidth(80)} + ${rem(0.4)})`,
  maxWidth: `calc(${rem(100)} + ${rem(0.4)})`,
  backgroundColor: 'white',
  margin: '0 auto',
  border: `${rem(0.2)} solid #C0C0C0`,
  borderTop: 0,
  borderBottom: 0,
  padding: rem(2)
})

export function IndexPage() {
  return (
    <div className={pageClassName}>
      <h1>Welcome!</h1>
      Please select one of the available demo:
      <ul>
        <li>
          <Link to="/plain">Plain</Link>: Simple plain text page with localStorage backend.
        </li>
        <li>
          <Link to="/table">Table</Link>: Dynamic table page with remote HTTP backend.
        </li>
      </ul>
    </div>
  )
}
