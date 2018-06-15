import { mount } from 'enzyme'
import React from 'react'
import { DefaultSidebar } from '../../../../src/components/ui/defaults/DefaultSidebar'
import { getDefaultResourceContext, withResourceContext } from '../../../helpers/context'

describe('DefaultSidebar', () => {
  test('renders correctly a sidebar and handle its close button even if nothing is provided', async () => {
    const context = getDefaultResourceContext({ listReferenceComments: jest.fn().mockReturnValue([]) })
    const controller = {
      reference: 'ref-1',
      isActive: jest.fn(),
      updateActive: jest.fn(),
      handleClick: jest.fn()
    }

    const wrapper = mount(withResourceContext(<DefaultSidebar controller={controller} />, context))

    expect(wrapper.find('h1.nf-commentami-sidebar__title').text()).toEqual('Comments')
    wrapper.find('a.nf-commentami-sidebar__close').simulate('click')
  })

  test('renders correctly a sidebar and handle its close button when a controller handle is present', async () => {
    const context = getDefaultResourceContext({ listReferenceComments: jest.fn().mockReturnValue([]) })
    const controller = {
      resource: 'RESOURCE',
      reference: 'REFERENCE',
      isActive: jest.fn(),
      updateActive: jest.fn(),
      handleClick: jest.fn()
    }

    const wrapper = mount(withResourceContext(<DefaultSidebar controller={controller} />, context))

    wrapper.find('a.nf-commentami-sidebar__close').simulate('click')

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

  test('should not render a close button when no click handler is on the controller', () => {
    const context = getDefaultResourceContext({ listReferenceComments: jest.fn().mockReturnValue([]) })
    const controller = {
      resource: 'RESOURCE',
      reference: 'REFERENCE',
      isActive: jest.fn(),
      updateActive: jest.fn()
    }

    const wrapper = mount(withResourceContext(<DefaultSidebar controller={controller} />, context))

    wrapper
      .find(DefaultSidebar)
      .instance()
      .handleClose({ preventDefault: jest.fn() })
    expect(wrapper.find('a.nf-commentami-sidebar__close').length).toEqual(0)
  })
})
