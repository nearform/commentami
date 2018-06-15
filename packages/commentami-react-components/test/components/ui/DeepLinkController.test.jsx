import React from 'react'
import { mount } from 'enzyme'
import { DeepLinkController, withDeepLink } from '../../../src/components/ui/DeepLinkController'

function Children() {
  return <p />
}

describe('DeepLinkController', () => {
  test('should render with good defaults', () => {
    const ControlledChildren = withDeepLink(Children)

    const wrapper = mount(
      <DeepLinkController>
        <ControlledChildren />
      </DeepLinkController>
    )

    expect(Object.keys(wrapper.find(Children).props().commentamiDeeplink)).toEqual([
      'resource',
      'reference',
      'comment',
      'hasDeepLink',
      'unsetDeepLink',
      'scrollIntoView'
    ])
  })

  test('should render with null props if the search query is empty', () => {
    const wrapper = mount(
      <DeepLinkController>
        <div />
      </DeepLinkController>
    )
    let state = wrapper.state()

    expect(state.resource).toEqual(null)
    expect(state.reference).toEqual(null)
    expect(state.comment).toEqual(null)
    expect(state.hasDeepLink).toBeFalsy()
  })

  test('should render with null props if the search qeury is empty', () => {
    jsdom.reconfigure({
      url: 'http://localhost/?resource=RESOURCE&reference=REFERENCE&comment=12345'
    })

    const wrapper = mount(
      <DeepLinkController>
        <div />
      </DeepLinkController>
    )
    let state = wrapper.state()

    expect(state.resource).toEqual('RESOURCE')
    expect(state.reference).toEqual('REFERENCE')
    expect(state.comment).toEqual('12345')
    expect(state.hasDeepLink).toBeTruthy()
  })

  test('the scrollIntoView should call the element function', () => {
    const wrapper = mount(
      <DeepLinkController>
        <div />
      </DeepLinkController>
    )
    const element = { scrollIntoView: jest.fn() }
    wrapper.instance().scrollIntoView(element)
    expect(element.scrollIntoView).toHaveBeenCalled()
  })

  test("the scrollIntoView should do nothing if the element is null or doesn't have a scrollIntoView method", () => {
    const wrapper = mount(
      <DeepLinkController>
        <div />
      </DeepLinkController>
    )
    const element = {}
    wrapper.instance().scrollIntoView(element)
    wrapper.instance().scrollIntoView()
  })

  test('unsetDeepLink shoud update the state', () => {
    jsdom.reconfigure({
      url: 'http://localhost/?resource=RESOURCE&reference=REFERENCE&comment=12345'
    })
    const wrapper = mount(
      <DeepLinkController>
        <div />
      </DeepLinkController>
    )
    wrapper.instance().unsetDeepLink()
    expect(wrapper.state().comment).toBeNull()
    expect(wrapper.state().hasDeepLink).toBeFalsy()
  })
})
