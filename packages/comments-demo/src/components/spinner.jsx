import { percent, rem } from 'csx'
import React from 'react'
import { keyframes, style } from 'typestyle'
import { debugClassName } from '../styling/environment'

export function Spinner(props) {
  const size = props.size || 66
  const stroke = props.stroke || 6

  /* Adapted from here: https://tech.scrunch.com/blog/creating-an-animated-svg-spinner/ */
  const animation = keyframes({
    [percent(0)]: { strokeDashoffset: size * 0.66, transform: 'rotate(0deg)' },
    [percent(50)]: { strokeDashoffset: size * 3.14, transform: 'rotate(720deg)' },
    [percent(100)]: { strokeDashoffset: size * 0.66, transform: 'rotate(1080deg)' }
  })

  const className = style(debugClassName('spinner'), {
    alignSelf: 'center',
    justifySelf: 'center',
    $nest: {
      '& svg': {
        width: rem(size / 10),
        height: rem(size / 10)
      },
      '& circle': {
        width: rem(size / 10),
        height: rem(size / 10),
        fill: 'transparent',
        stroke: props.color || '#808080',
        strokeWidth: stroke,
        strokeLinecap: 'round',
        strokeDasharray: [size * 3.14],
        animation: `${animation} 2s linear infinite`,
        transformOrigin: 'center'
      }
    }
  })

  return (
    <main className={className}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle fill="none" strokeWidth="6" strokeLinecap="round" cx={size / 2} cy={size / 2} r={(size - stroke) / 2} />
      </svg>
      {props.text && <h3>{props.text}</h3>}
    </main>
  )
}
