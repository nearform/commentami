import React from 'react'
import { ResourceContext } from '../../src/components/core/Resource'
import { SidebarsControllerContext } from '../../src/components/ui/SidebarsController'
import { DeepLinkControllerContext } from '../../src/components/ui/DeepLinkController'
import { getDefaultState } from '../../src/state/helpers/getters'

export async function delay(timeout = 10) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export function withResourceContext(children, context = 'commentable') {
  return (
    <main id="provider">
      <ResourceContext.Provider value={context} children={children} />
    </main>
  )
}

export function withSidebarsControllerContext(children, context = 'sidebars') {
  return (
    <main id="controller">
      <SidebarsControllerContext.Provider value={context} children={children} />
    </main>
  )
}

export function withDeepLinkControllerContext(children, context = 'sidebars') {
  return (
    <main id="controller">
      <DeepLinkControllerContext.Provider value={context} children={children} />
    </main>
  )
}

export function getDefaultResourceContext(overrides = {}) {
  return {
    resource: 'RESOURCE',
    commentsState: getDefaultState(),
    addComment: jest.fn(),
    removeComment: jest.fn(),
    ...overrides
  }
}
