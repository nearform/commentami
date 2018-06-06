import { em, rem, viewWidth } from 'csx'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { style } from 'typestyle'
import { debugClassName } from '../styling/environment'

const headerClassName = style(debugClassName('header'), {
  backgroundColor: '#DA3338'
})

const headerNavClassName = style(debugClassName('header-nav'), {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  width: viewWidth(80),
  maxWidth: rem(100),
  height: rem(6),
  margin: '0 auto'
})

const headerTitleClassName = style(debugClassName('header-title'), {
  display: 'inline-block',
  color: 'white',
  fontWeight: 'bold',
  margin: 0,
  padding: `${rem(1)} ${rem(2)}`,
  fontSize: em(2),
  flex: 1,
  $nest: {
    '&:hover, &:hover:not(.active)': {
      color: '#F0D030'
    }
  }
})

const headerLinkClassName = style(debugClassName('header-link'), {
  display: 'inline-flex',
  color: 'white',
  fontWeight: 'bold',
  padding: `${rem(1)} ${rem(2)}`,
  height: '75%',
  alignItems: 'center',
  transition: 'all 0.2s ease',
  borderTop: `${rem(0.2)} solid transparent`,
  $nest: {
    '&:hover, &.active': {
      color: '#DA3338',
      backgroundColor: 'white',
      borderTopColor: `#C0C0C0`
    }
  }
})

export function Header() {
  return (
    <header className={headerClassName}>
      <nav className={headerNavClassName}>
        <NavLink to="/" className={headerTitleClassName}>
          Comments Demo
        </NavLink>

        <NavLink to="/plain" className={headerLinkClassName}>
          Plain Text
        </NavLink>
        <NavLink to="/markdown" className={headerLinkClassName}>
          Markdown
        </NavLink>
        <NavLink to="/table" className={headerLinkClassName}>
          Table
        </NavLink>
      </nav>
    </header>
  )
}
