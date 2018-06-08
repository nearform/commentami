import { mount } from 'enzyme'
import React from 'react'
import { Sidebar } from '../../../src/components/ui/Sidebar'
import { withCommentableContext, withSidebarsControllerContext } from '../../helpers/context'

function Children({ commentable, resource }) {
  return <p>children</p>
}

describe('Sidebar', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  test('should use the default sidebar by default', async () => {
    const controller = { isActive: () => true }

    const wrapper = mount(withSidebarsControllerContext(withCommentableContext(<Sidebar />), controller))

    expect(wrapper.find('h1.nf-comments-sidebar__title').text()).toEqual('Comments')
  })

  test('should use the provided component', async () => {
    const controller = { isActive: () => true }

    const wrapper = mount(
      withSidebarsControllerContext(withCommentableContext(<Sidebar component={Children} />), controller)
    )

    expect(wrapper.find('p').text()).toEqual('children')
  })

  test('renders correctly but return false for isActive', async () => {
    const controller = { isActive: () => false }

    const wrapper = mount(withSidebarsControllerContext(withCommentableContext(<Sidebar />), controller))

    expect(
      wrapper
        .find('#provider')
        .children()
        .first()
        .html()
    ).toBeNull()
  })
})
