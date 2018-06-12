import { percent, rem } from 'csx'
import React from 'react'
import { keyframes, style, classes } from 'typestyle'

export function Spinner({ className, size, stroke, color, text }) {
  if (!size) size = 66
  if (!stroke) stroke = 6

  /* Adapted from here: https://tech.scrunch.com/blog/creating-an-animated-svg-spinner/ */
  const animation = keyframes({
    [percent(0)]: { strokeDashoffset: size * 0.66, transform: 'rotate(0deg)' },
    [percent(50)]: {
      strokeDashoffset: size * 3.14,
      transform: 'rotate(720deg)'
    },
    [percent(100)]: {
      strokeDashoffset: size * 0.66,
      transform: 'rotate(1080deg)'
    }
  })

  const baseClassName = style({
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
        stroke: color || '#808080',
        strokeWidth: stroke,
        strokeLinecap: 'round',
        strokeDasharray: [size * 3.14],
        animation: `${animation} 2s linear infinite`,
        transformOrigin: 'center'
      }
    }
  })

  return (
    <div className={classes(baseClassName, className)}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle fill="none" strokeWidth="6" strokeLinecap="round" cx={size / 2} cy={size / 2} r={(size - stroke) / 2} />
      </svg>
      {text && <h3>{text}</h3>}
    </div>
  )
}
