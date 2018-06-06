import { mount } from 'enzyme'
import React from 'react'
import { getComponentWithContext } from '../../helpers/context'

function createComponent(context) {
  return getComponentWithContext(
    'CommentableBlock',
    context,
    'CommentableContext',
    require.resolve('../../../src/components/core/CommentableBlock'),
    require.resolve('../../../src/components/core/CommentableProvider')
  )
}

describe('CommentableBlock', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  test('should warn if included without a reference', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    const CommentableBlock = createComponent({})

    const wrapper = mount(<CommentableBlock />)

    wrapper.setProps({ a: 1 })

    expect(errorSpy).toHaveBeenCalledWith('Warning: The CommentableBlock component should have a reference prop')
    expect(errorSpy).toHaveBeenCalledTimes(2)
  })
})
