import React from 'react'
import { ResourceContext } from '../../src/components/core/Resource'
import { SidebarsControllerContext } from '../../src/components/ui/SidebarsController'

export function withResourceContext(children, context = {}) {
  return (
    <main id="provider">
      <ResourceContext.Provider value={context} children={children} />
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
