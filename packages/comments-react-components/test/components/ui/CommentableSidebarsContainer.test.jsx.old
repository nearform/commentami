import { shallow } from 'enzyme'
import React from 'react'
import { CommentableSidebarsContainer, CommentableSidebarsContext } from '../../../src/components/ui/CommentableSidebarsContainer'

describe('CommentableSidebarsContext', () => {
  test('should render with good defaults', () => {
    const wrapper = shallow(
      <CommentableSidebarsContainer>
        <CommentableSidebarsContext.Consumer>{value => <p />}</CommentableSidebarsContext.Consumer>
      </CommentableSidebarsContainer>
    )

    expect(wrapper.find(<p />)).toBeTruthy()
  })

  test('should maintain the right active resource and reference', () => {
    const wrapper = shallow(
      <CommentableSidebarsContainer>
        <CommentableSidebarsContext.Consumer>{value => <p />}</CommentableSidebarsContext.Consumer>
      </CommentableSidebarsContainer>
    )

    const state = wrapper.instance().state

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
  })
})
