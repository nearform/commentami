import React from 'react'
import { mount } from 'enzyme'

import { CommentableDefaultComment } from '../../../../src/components/ui/defaults/CommentableDefaultComment'

describe('CommentableDefaultComment', () => {
  test('renders correctly a comment', async () => {
    const comment = {
      author: 'my author',
      content: 'my content'
    }
    const wrapper = mount(<CommentableDefaultComment removeComment={() => {}} comment={comment} />)

    expect(wrapper.find('article').length).toEqual(1)
    expect(wrapper.find('h4').length).toEqual(1)
    expect(wrapper.find('button').length).toEqual(1)
  })

  test('renders null if there is no comment to render', async () => {
    const wrapper = mount(<CommentableDefaultComment removeComment={() => {}} />)

    expect(wrapper.find('article').length).toEqual(0)
  })

  test('clicking on the remove button will invoce the removeComment function', async () => {
    const comment = {
      author: 'my author',
      content: 'my content'
    }
    const onButtonClick = jest.fn()
    const wrapper = mount(<CommentableDefaultComment removeComment={onButtonClick} comment={comment} />)

    expect(wrapper.find('article').length).toEqual(1)
    expect(wrapper.find('h4').length).toEqual(1)
    expect(wrapper.find('button').length).toEqual(1)

    wrapper.find('button').simulate('click', { preventDefault() {} })

    expect(onButtonClick.mock.calls.length).toEqual(1)
  })
})
