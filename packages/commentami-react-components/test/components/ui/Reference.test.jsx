import { mount } from 'enzyme'
import React from 'react'
import { Reference } from '../../../src/components/ui/Reference'
import { getDefaultResourceContext, withResourceContext, withSidebarsControllerContext } from '../../helpers/context'
import { createComment } from '../../../src/state/helpers/creators'
import { getDefaultState } from '../../../src/state/helpers/getters'
import { setCommentToResource } from '../../../src/state/reducers/resource'

function Children({ withResource, resource }) {
  return <span>1</span>
}

describe('Reference', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  test('should render without the active class and without a marker by default', () => {
    const controller = { isActive: () => false, updateActive: () => null }

    const wrapper = mount(
      withSidebarsControllerContext(
        withResourceContext(
          <Reference reference="ref-1">
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
    const controller = { isActive: () => true, updateActive: () => null }

    const context = getDefaultResourceContext({
      commentsState: setCommentToResource(
        getDefaultState('RESOURCE'),
        { id: 'REFERENCE' },
        createComment({
          reference: { id: 'REFERENCE' },
          id: 'comm-1',
          content: 'AAA'
        })
      )
    })

    const wrapper = mount(
      withSidebarsControllerContext(
        withResourceContext(
          <Reference reference="REFERENCE">
            <div />
          </Reference>,
          context
        ),
        controller
      )
    )

    expect(wrapper.find('.nf-comments-block').length).toEqual(1)
    expect(wrapper.find('.nf-comments-block--active').length).toEqual(1)
    expect(wrapper.find('span.nf-comments-marker').length).toEqual(1)
  })

  test('should use a custom marker', () => {
    const controller = { isActive: () => true, updateActive: () => null }

    const context = getDefaultResourceContext({
      commentsState: setCommentToResource(
        getDefaultState('RESOURCE'),
        { id: 'REFERENCE' },
        createComment({
          reference: { id: 'REFERENCE' },
          id: 'comm-1',
          content: 'AAA'
        })
      )
    })

    const wrapper = mount(
      withSidebarsControllerContext(
        withResourceContext(
          <Reference reference="REFERENCE" activeClassName="foo" markerComponent={Children}>
            <div />
          </Reference>,
          context
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
      updateActive: () => null,
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
