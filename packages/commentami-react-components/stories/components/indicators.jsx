import { percent, px, viewWidth } from 'csx'
import React from 'react'
import { style, classes } from 'typestyle'
import { withResource } from '../../src/components/core/HOC'
import { Spinner } from './spinner'

const indicatorClassName = style({
  position: 'absolute',
  top: px(20),
  left: `calc(${percent(50)} - ${viewWidth(20)})`,
  backgroundColor: '#FDD835',
  borderRadius: px(10),
  width: viewWidth(40),
  zIndex: 10
})

const loadingIndicatorClassName = style({
  backgroundColor: '#FDD835'
})

const errorIndicatorClassName = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: px(10),
  backgroundColor: '#EE4444',
  color: 'white'
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
    <div className={classes(indicatorClassName, loadingIndicatorClassName)}>
      <Spinner className={loadingSpinnerClassName} text="Loading comments..." color="#444" size={16} stroke={2} />
    </div>
  )
})

export const ErrorIndicator = withResource(function ErrorIndicatorBase({
  commentami: { initError, fetchError, updateError }
}) {
  const error = [initError, fetchError, updateError].find(e => e)
  if (!error) return false

  return (
    <div className={classes(indicatorClassName, errorIndicatorClassName)}>Cannot load comments: {error.message}</div>
  )
})
