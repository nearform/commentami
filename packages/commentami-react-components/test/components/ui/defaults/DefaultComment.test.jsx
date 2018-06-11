import { mount } from 'enzyme'
import React from 'react'
import { DefaultComment } from '../../../../src/components/ui/defaults/DefaultComment'

describe('DefaultComment', () => {
  test('renders correctly a comment', async () => {
    const comment = {
      author: 'my author',
      content: 'my content'
    }
    const wrapper = mount(<DefaultComment removeComment={() => {}} comment={comment} />)

    expect(wrapper.find('article').length).toEqual(1)
    expect(wrapper.find('h4').length).toEqual(1)
    expect(wrapper.find('button').length).toEqual(1)
  })

  test('renders null if there is no comment to render', async () => {
    const wrapper = mount(<DefaultComment removeComment={() => {}} />)

    expect(wrapper.find('article').length).toEqual(0)
  })

  test('clicking on the remove button will invoce the removeComment function', async () => {
    const comment = {
      author: 'my author',
      content: 'my content'
    }
    const onButtonClick = jest.fn()
    const wrapper = mount(<DefaultComment removeComment={onButtonClick} comment={comment} />)

    expect(wrapper.find('article').length).toEqual(1)
    expect(wrapper.find('h4').length).toEqual(1)
    expect(wrapper.find('button').length).toEqual(1)

    wrapper.find('button').simulate('click', { preventDefault() {} })

    expect(onButtonClick.mock.calls.length).toEqual(1)
  })
})
