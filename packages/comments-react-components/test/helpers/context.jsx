import React from 'react'
import { CommentableContext } from '../../src/components/core/Resource'
import { SidebarsControllerContext } from '../../src/components/ui/SidebarsController'

export function withCommentableContext(children, context = {}) {
  return (
    <main id="provider">
      <CommentableContext.Provider value={context} children={children} />
    </main>
  )
}

export function withSidebarsControllerContext(children, context = {}) {
  return (
    <main id="controller">
      <SidebarsControllerContext.Provider value={context} children={children} />
    </main>
  )
}
