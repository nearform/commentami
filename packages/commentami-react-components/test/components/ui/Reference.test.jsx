import { mount } from 'enzyme'
import React from 'react'
import { Reference } from '../../../src/components/ui/Reference'
import { getDefaultResourceContext, withResourceContext, withSidebarsControllerContext } from '../../helpers/context'

function Children({ withResource, resource }) {
  return <span>1</span>
}

describe('Reference', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  test.only('should render without the active class and without a marker by default', () => {
    const controller = { isActive: () => false }

    const wrapper = mount(
      withSidebarsControllerContext(
        withResourceContext(
          <Reference reference="ref-1" resource="res-1">
            <div />
          </Reference>,
          getDefaultResourceContext()
        ),
        controller
      )
    )

    expect(wrapper.find('.nf-comments-block').length).toEqual(1)
    expect(wrapper.find('.nf-comments-block--active').length).toEqual(0)
    expect(wrapper.find('.nf-comments-marker').length).toEqual(0)
  })

  test('should render with the active class and with a marker', () => {
    const controller = { isActive: () => true }

    const wrapper = mount(
      withSidebarsControllerContext(
        withResourceContext(
          <Reference reference="ref-1" resource="res-1" hasComments>
            <div />
          </Reference>,
          getDefaultResourceContext()
        ),
        controller
      )
    )

    expect(wrapper.find('.nf-comments-block').length).toEqual(1)
    expect(wrapper.find('.nf-comments-block--active').length).toEqual(1)
    expect(wrapper.find('span.nf-comments-marker').length).toEqual(1)
  })

  test('should use a custom marker', () => {
    const controller = { isActive: () => true }

    const wrapper = mount(
      withSidebarsControllerContext(
        withResourceContext(
          <Reference reference="ref-1" resource="res-1" hasComments activeClassName="foo" markerComponent={Children}>
            <div />
          </Reference>,
          getDefaultResourceContext()
        ),
        controller
      )
    )

    expect(wrapper.find('.foo').length).toEqual(1)
    expect(wrapper.contains(<span>1</span>)).toBeTruthy()
  })

  test('should handle events', () => {
    const handler = jest.fn()
    const controller = {
      isActive: () => true,
      handleClick: handler,
      handleContextMenu: handler,
      handleDoubleClick: handler,
      handleMouseEnter: handler,
      handleMouseLeave: handler,
      handleSelect: handler
    }

    const wrapper = mount(
      withSidebarsControllerContext(
        withResourceContext(
          <Reference reference="ref-1" resource="res-1" hasComments activeClassName="foo" markerComponent={Children}>
            <div />
          </Reference>,
          getDefaultResourceContext()
        ),
        controller
      )
    )

    const instance = wrapper.find(Reference).first()

    instance.simulate('click')
    instance.simulate('contextMenu')
    instance.simulate('doubleClick')
    instance.simulate('mouseEnter')
    instance.simulate('mouseLeave')
    instance.simulate('select')

    expect(handler).toHaveBeenCalledTimes(6)
  })
})
