import { mount } from 'enzyme'
import React from 'react'
import { CommentableController, commentableWithController } from '../../../src/components/ui/CommentableController'

function Children({ controller }) {
  const keys = Object.keys(controller)
    .sort()
    .join('--')

  return <p>{keys}</p>
}

describe('CommentableController', () => {
  test('should render with good defaults', () => {
    const ControlledChildren = commentableWithController(Children)
    const wrapper = mount(
      <CommentableController>
        <ControlledChildren />
      </CommentableController>
    )

    expect(
      wrapper.contains(<p>handleClick--handleDoubleClick--isActive--reference--resource--toggleActive--updateActive</p>)
    ).toBeTruthy()
  })

  test('should maintain the right active resource and reference', () => {
    const wrapper = mount(<CommentableController />)
    let state = wrapper.state()

    expect(state.isActive('RESOURCE')).toBeFalsy()

    state.updateActive('RESOURCE', 'REFERENCE')
    expect(state.isActive('RESOURCE')).toBeTruthy()
    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeTruthy()
    expect(state.isActive('RESOURCE', 'ANOTHER-REFERENCE')).toBeFalsy()

    state.updateActive('ANOTHER-RESOURCE', 'REFERENCE')
    expect(state.isActive('RESOURCE')).toBeFalsy()
    expect(state.isActive('ANOTHER-RESOURCE')).toBeTruthy()

    state.updateActive()
    expect(state.isActive('RESOURCE')).toBeFalsy()
    expect(state.isActive('ANOTHER-RESOURCE')).toBeFalsy()

    state.toggleActive({ resource: 'RESOURCE', reference: 'REFERENCE' })
    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeTruthy()
    state.toggleActive({ resource: 'RESOURCE', reference: 'REFERENCE' })
    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeFalsy()
  })

  test('should correctly handle marker click events', () => {
    const wrapper = mount(<CommentableController />)
    let state = wrapper.state()

    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeFalsy()
    wrapper.instance().handleClick({
      resource: 'RESOURCE',
      reference: 'REFERENCE',
      scope: 'marker'
    })
    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeTruthy()
    wrapper.instance().handleClick({
      resource: 'RESOURCE',
      reference: 'REFERENCE',
      scope: 'marker'
    })
    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeFalsy()
  })

  test('should correctly handle sidebar closing events', () => {
    const wrapper = mount(<CommentableController />)
    let state = wrapper.state()

    state.updateActive('RESOURCE', 'REFERENCE')
    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeTruthy()
    wrapper.instance().handleClick({
      resource: 'RESOURCE',
      reference: 'REFERENCE',
      scope: 'sidebar-close'
    })
    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeFalsy()
  })

  test('should correctly handle double click events', () => {
    window.getSelection = jest.fn().mockReturnValue({ removeAllRanges: jest.fn() })

    const wrapper = mount(<CommentableController />)
    let state = wrapper.state()

    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeFalsy()
    wrapper.instance().handleDoubleClick({ resource: 'RESOURCE', reference: 'REFERENCE' })
    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeTruthy()
    wrapper.instance().handleDoubleClick({ resource: 'RESOURCE', reference: 'REFERENCE' })
    expect(state.isActive('RESOURCE', 'REFERENCE')).toBeFalsy()
  })
})
