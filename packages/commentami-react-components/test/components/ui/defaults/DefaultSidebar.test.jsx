import { mount } from 'enzyme'
import React from 'react'
import { DefaultSidebar } from '../../../../src/components/ui/defaults/DefaultSidebar'
import { withResourceContext } from '../../../helpers/context'

describe('DefaultSidebar', () => {
  test('renders correctly a sidebar and handle its close button even if nothing is provided', async () => {
    const context = { listReferenceComments: jest.fn().mockReturnValue([]) }
    const controller = {
      reference: 'ref-1'
    }

    const wrapper = mount(withResourceContext(<DefaultSidebar controller={controller} />, context))

    expect(wrapper.find('h1.nf-comments-sidebar__title').text()).toEqual('Comments')
    wrapper.find('.nf-comments-sidebar__close').simulate('click')
  })

  test('renders correctly a sidebar and handle its close button when a controller handle is present', async () => {
    const context = { listReferenceComments: jest.fn().mockReturnValue([]) }
    const controller = {
      resource: 'RESOURCE',
      reference: 'REFERENCE',
      handleClick: jest.fn()
    }

    const wrapper = mount(withResourceContext(<DefaultSidebar controller={controller} />, context))

    wrapper.find('.nf-comments-sidebar__close').simulate('click')

    expect(controller.handleClick).toHaveBeenCalledWith(
      {
        resource: 'RESOURCE',
        reference: 'REFERENCE',
        ref: expect.anything(),
        scope: 'sidebar-close'
      },
      expect.anything()
    )
  })
})
