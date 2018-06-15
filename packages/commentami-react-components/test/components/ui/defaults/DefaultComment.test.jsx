import { mount, shallow } from 'enzyme'
import React from 'react'
import { DefaultComment, DefaultCommentBase } from '../../../../src/components/ui/defaults/DefaultComment'
import { withDeepLinkControllerContext } from '../../../helpers/context'

describe('DefaultComment', () => {
  let commentamiDeeplinkContext

  beforeEach(() => {
    commentamiDeeplinkContext = {}
  })

  test('renders correctly a comment without deeplink', async () => {
    const comment = {
      id: 'comm-1',
      author: 'my author',
      content: 'my content'
    }
    const wrapper = mount(<DefaultCommentBase removeComment={jest.fn()} comment={comment} />)

    expect(wrapper.find('article').length).toEqual(1)
    expect(wrapper.find('h5').length).toEqual(1)
    expect(wrapper.find('h5').text()).toEqual('my author said')
    expect(wrapper.find('button').length).toEqual(1)
  })

  test('renders correctly a comment with structured author', async () => {
    const comment = {
      id: 'comm-1',
      author: {
        profileUrl: 'someUrl',
        avatarUrl: 'someAvatarUrl',
        firstName: 'Davide',
        lastName: 'Fiorello'
      },
      content: 'my content'
    }
    const wrapper = mount(<DefaultCommentBase removeComment={jest.fn()} comment={comment} />)

    expect(wrapper.find('article').length).toEqual(1)
    expect(wrapper.find('a[href="someUrl"]').length).toEqual(1)
    expect(wrapper.find('a[href="someUrl"] img').props().src).toEqual('someAvatarUrl')
    expect(wrapper.find('a[href="someUrl"] > div > div').text()).toEqual('Davide F.')
    expect(wrapper.find('button').length).toEqual(1)
  })

  test('renders correctly a comment', async () => {
    const comment = {
      id: 'comm-1',
      author: 'my author',
      content: 'my content'
    }
    const wrapper = mount(
      withDeepLinkControllerContext(
        <DefaultComment removeComment={jest.fn()} comment={comment} />,
        commentamiDeeplinkContext
      )
    )

    expect(wrapper.find('article').length).toEqual(1)
    expect(wrapper.find('h5').length).toEqual(1)
    expect(wrapper.find('h5').text()).toEqual('my author said')
    expect(wrapper.find('button').length).toEqual(1)
  })

  test('highlight the comment if is the current from deeplink', async () => {
    jest.useFakeTimers()
    const comment = {
      id: 'comm-1',
      author: 'my author',
      content: 'my content'
    }
    const unsetDeepLinkMock = jest.fn()
    const scrollToLinkLinkMock = jest.fn()
    const wrapper = mount(
      <DefaultCommentBase
        removeComment={jest.fn()}
        comment={comment}
        commentamiDeeplink={{
          deepLink: true,
          comment: 'comm-1',
          unsetDeepLink: unsetDeepLinkMock,
          scrollIntoView: scrollToLinkLinkMock
        }}
      />
    )

    expect(scrollToLinkLinkMock).toHaveBeenCalled()
    expect(wrapper.state('isHighlighted')).toBeTruthy()

    jest.advanceTimersByTime(10)
    expect(unsetDeepLinkMock).toHaveBeenCalled()
    jest.advanceTimersByTime(2000)
    expect(wrapper.state('isHighlighted')).toBeFalsy()
  })

  test('renders null if there is no comment to render', async () => {
    const wrapper = mount(
      withDeepLinkControllerContext(<DefaultComment removeComment={() => {}} />, commentamiDeeplinkContext)
    )

    expect(wrapper.find('article').length).toEqual(0)
  })

  test('clicking on the remove button will invoce the removeComment function', async () => {
    const comment = {
      id: 'comm-1',
      author: 'my author',
      content: 'my content'
    }
    const onButtonClick = jest.fn()
    const wrapper = mount(
      withDeepLinkControllerContext(
        <DefaultComment removeComment={onButtonClick} comment={comment} />,
        commentamiDeeplinkContext
      )
    )

    expect(wrapper.find('article').length).toEqual(1)
    expect(wrapper.find('h5').length).toEqual(1)
    expect(wrapper.find('h5').text()).toEqual('my author said')
    expect(wrapper.find('button').length).toEqual(1)

    wrapper.find('button').simulate('click', {
      preventDefault() {}
    })

    expect(onButtonClick.mock.calls.length).toEqual(1)
  })
})
