import React from 'react'
import { CommentableContext } from '../../src/components/core/CommentableProvider'
import { CommentableControllerContext } from '../../src/components/ui/CommentableController'

export function withCommentableContext(children, context = {}) {
  return (
    <main id="provider">
      <CommentableContext.Provider value={context} children={children} />
    </main>
  )
}

export function withCommentableControllerContext(children, context = {}) {
  return (
    <main id="controller">
      <CommentableControllerContext.Provider value={context} children={children} />
    </main>
  )
}
