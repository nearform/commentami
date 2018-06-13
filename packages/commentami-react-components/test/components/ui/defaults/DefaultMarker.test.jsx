import { mount } from 'enzyme'
import React from 'react'
import { DefaultMarker } from '../../../../src/components/ui/defaults/DefaultMarker'

describe('DefaultMarker', () => {
  test('renders correctly a marker and handles click events', async () => {
    const ref = React.createRef()
    const controller = { isActive: () => true, updateActive: jest.fn(), handleClick: jest.fn() }
    const wrapper = mount(
      <DefaultMarker controller={controller} rootRef={ref} reference="REFERENCE" resource="RESOURCE" />
    )

    expect(wrapper.find('svg').prop('viewBox')).toEqual('0 0 96 96')

    wrapper.find('span').simulate('click')

    expect(controller.handleClick).toHaveBeenCalledWith(
      { ref, reference: 'REFERENCE', resource: 'RESOURCE', scope: 'marker' },
      expect.anything()
    )
  })
})
