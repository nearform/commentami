import { withResource } from '@nearform/commentami-react-components'
import { percent, px, viewWidth } from 'csx'
import React from 'react'
import { style } from 'typestyle'
import { Spinner } from './spinner'

const loadingIndicatorClassName = style({
  position: 'absolute',
  top: px(70),
  left: `calc(${percent(50)} - ${viewWidth(20)})`,
  backgroundColor: '#FDD835',
  borderRadius: px(10),
  width: viewWidth(40),
  zIndex: 10
})

const loadingSpinnerClassName = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: px(10),
  $nest: {
    h3: {
      margin: `0 0 0 ${px(20)}`
    }
  }
})

export const LoadingIndicator = withResource(function LoadingIndicatorBase({ commentami: { isInit, isFetching } }) {
  if (isInit && !isFetching) return false

  return (
    <div className={loadingIndicatorClassName}>
      <Spinner className={loadingSpinnerClassName} text="Loading ..." color="#444" size={16} stroke={2} />
    </div>
  )
})
