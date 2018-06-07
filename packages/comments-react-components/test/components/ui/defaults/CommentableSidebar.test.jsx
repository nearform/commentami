import { mount } from 'enzyme'
import React from 'react'
import { CommentableDefaultSidebar } from '../../../../src/components/ui/defaults/CommentableDefaultSidebar'
import { withCommentableContext } from '../../../helpers/context'

describe('CommentableDefaultSidebar', () => {
  test('renders correctly a sidebar and handle its close button even if nothing is provided', async () => {
    const controller = {}

    const wrapper = mount(withCommentableContext(<CommentableDefaultSidebar controller={controller} />))

    expect(wrapper.find('h1.nf-comments-sidebar__title').text()).toEqual('Comments')
    wrapper.find('.nf-comments-sidebar__close').simulate('click')
  })

  test('renders correctly a sidebar and handle its close button when a controller handle is present', async () => {
    const controller = { resource: 'RESOURCE', reference: 'REFERENCE', handleClick: jest.fn() }

    const wrapper = mount(withCommentableContext(<CommentableDefaultSidebar controller={controller} />))

    wrapper.find('.nf-comments-sidebar__close').simulate('click')

    expect(controller.handleClick).toHaveBeenCalledWith(
      { resource: 'RESOURCE', reference: 'REFERENCE', ref: expect.anything(), scope: 'sidebar-close' },
      expect.anything()
    )
  })
})
