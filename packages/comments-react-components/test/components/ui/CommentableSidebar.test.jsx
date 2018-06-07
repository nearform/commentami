import { mount } from 'enzyme'
import React from 'react'
import { CommentableSidebar } from '../../../src/components/ui/CommentableSidebar'
import { withCommentableContext, withCommentableControllerContext } from '../../helpers/context'

function Children({ commentable, resource }) {
  return <p>children</p>
}

describe('CommentableSidebar', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  test('should use the default sidebar by default', async () => {
    const controller = { isActive: () => true }

    const wrapper = mount(withCommentableControllerContext(withCommentableContext(<CommentableSidebar />), controller))

    expect(wrapper.find('h1.nf-comments-sidebar__title').text()).toEqual('Comments')
  })

  test('should use the provided component', async () => {
    const controller = { isActive: () => true }

    const wrapper = mount(withCommentableControllerContext(withCommentableContext(<CommentableSidebar component={Children} />), controller))

    expect(wrapper.find('p').text()).toEqual('children')
  })

  test('renders correctly but return false for isActive', async () => {
    const controller = { isActive: () => false }

    const wrapper = mount(withCommentableControllerContext(withCommentableContext(<CommentableSidebar />), controller))

    expect(
      wrapper
        .find('#provider')
        .children()
        .first()
        .html()
    ).toBeNull()
  })
})
