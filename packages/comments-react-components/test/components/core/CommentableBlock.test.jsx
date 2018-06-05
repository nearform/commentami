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

  test('.renderProps should declare no comments by default', () => {
    const CommentableBlock = createComponent({})

    const wrapper = mount(<CommentableBlock />)
    expect(wrapper.instance().renderProps).toEqual({ hasComments: false })
  })

  test('.renderProps should declare comments if they are present', () => {
    const CommentableBlock = createComponent({ commentsState: { comments: [{ reference: 'REFERENCE' }] } })

    const wrapper = mount(<CommentableBlock reference="REFERENCE" />)
    expect(wrapper.instance().renderProps).toEqual({ hasComments: true, reference: 'REFERENCE' })
  })
})
