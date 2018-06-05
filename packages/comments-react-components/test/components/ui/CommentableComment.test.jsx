import React from 'react'
import { mount } from 'enzyme'

import { CommentableComment } from '../../../src/components/ui/CommentableComment'

describe('CommentableCommentComponent', () => {
  let wrapper

  test('renders correctly a comment', async () => {
    const comment = {
      author: 'my author',
      content: 'my content'
    }
    wrapper = mount(<CommentableComment removeComment={() => {}} comment={comment} />)

    expect(wrapper.find('article').length).toBe(1)
    expect(wrapper.find('h4').length).toBe(1)
    expect(wrapper.find('button').length).toBe(1)
  })

  test('renders null if there is no comment to render', async () => {
    wrapper = mount(<CommentableComment removeComment={() => {}} />)

    expect(wrapper.find('article').length).toBe(0)
  })

  test('clicking on the remove button will invoce the removeComment function', async () => {
    const comment = {
      author: 'my author',
      content: 'my content'
    }
    const onButtonClick = jest.fn()
    wrapper = mount(<CommentableComment removeComment={onButtonClick} comment={comment} />)

    expect(wrapper.find('article').length).toBe(1)
    expect(wrapper.find('h4').length).toBe(1)
    expect(wrapper.find('button').length).toBe(1)

    wrapper.find('button').simulate('click', { preventDefault() {} })

    expect(onButtonClick.mock.calls.length).toBe(1)
  })
})
