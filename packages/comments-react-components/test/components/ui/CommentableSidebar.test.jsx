import React from 'react'
import { mount } from 'enzyme'

import { CommentableContext } from '../../../src/components/core/CommentableProvider'
import { CommentableControllerContext } from '../../../src/components/ui/CommentableController'
import { CommentableSidebar } from '../../../src/components/ui/CommentableSidebar'

function Children({ commentable, resource }) {
  return <span>1</span>
}

describe('CommentableSidebar', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  test('should use the default sidebar by default', async () => {
    const controller = { isActive: () => true }

    const wrapper = mount(
      <div>
        <CommentableContext.Provider value={{}}>
          <CommentableControllerContext.Provider value={controller}>
            <CommentableSidebar />
          </CommentableControllerContext.Provider>
        </CommentableContext.Provider>
      </div>
    )

    expect(wrapper.find('h1.nf-comments-sidebar__title').text()).toEqual('Comments')
  })

  test('should use the provided component', async () => {
    const controller = { isActive: () => true }

    const wrapper = mount(
      <div>
        <CommentableContext.Provider value={{}}>
          <CommentableControllerContext.Provider value={controller}>
            <CommentableSidebar component={Children} />
          </CommentableControllerContext.Provider>
        </CommentableContext.Provider>
      </div>
    )

    expect(wrapper.find('span').text()).toEqual('1')
  })

  test('renders correctly but return false for isActive', async () => {
    const controller = { isActive: () => false }

    const wrapper = mount(
      <div>
        <CommentableContext.Provider value={{}}>
          <CommentableControllerContext.Provider value={controller}>
            <CommentableSidebar />
          </CommentableControllerContext.Provider>
        </CommentableContext.Provider>
      </div>
    )

    expect(wrapper.html()).toEqual('<div></div>')
  })
})
