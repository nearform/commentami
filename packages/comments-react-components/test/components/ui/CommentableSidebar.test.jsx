import React from 'react'
import { mount } from 'enzyme'

function createComponent(fakeContext, sidebarContext, createPortal = () => null) {
  jest.doMock(require.resolve('react-dom'), () => {
    return {
      'createPortal': createPortal
    }
  })

  jest.doMock(require.resolve('../../../src/components/core/CommentableProvider'), () => {
    return {
      'CommentableContext': {
        Consumer: props => props.children(fakeContext)
      }
    }
  })

  jest.doMock(require.resolve('../../../src/components/ui/CommentableSidebarsContainer'), () => {
    return {
      'CommentableSidebarsContext': {
        Consumer: props => props.children(sidebarContext)
      }
    }
  })

  return require(require.resolve('../../../src/components/ui/CommentableSidebar'))['CommentableSidebar']
}

describe('CommentableSidebarComponent', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  test('does not render if no sidebar is passed', async () => {
    const CommentableSidebar = createComponent({ commentable: {} })
    const wrapper = mount(<CommentableSidebar />)
    expect(wrapper.html()).toBe(null)
  })

  test('renders correctly a fake portal', async () => {
    const CommentableSidebar = createComponent({ commentable: {} }, { isActive: () => true }, () => {
      return (<div className="test-class">Test</div>)
    })
    const wrapper = mount(<CommentableSidebar />, { context: { commentable: {} } })
    expect(wrapper.find('.test-class').length).toBe(1)
  })

  test('renders correctly but return false for isActive', async () => {
    const CommentableSidebar = createComponent({ commentable: {} }, { isActive: () => false }, () => {
      return (<div className="test-class">Test</div>)
    })
    const wrapper = mount(<CommentableSidebar />, { context: { commentable: {} } })
    expect(wrapper.html()).toBe(null)
  })
})
