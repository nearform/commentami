import { mount } from 'enzyme'
import React from 'react'
import { Sidebar } from '../../../src/components/ui/Sidebar'
import { withResourceContext, withSidebarsControllerContext } from '../../helpers/context'

function Children({ withResource, resource }) {
  return <p>children</p>
}

describe('Sidebar', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  test('should use the default sidebar by default', async () => {
    const context = { listReferenceComments: jest.fn().mockReturnValue([]) }
    const controller = { isActive: () => true, reference: 'ref-1' }

    const wrapper = mount(withSidebarsControllerContext(withResourceContext(<Sidebar />, context), controller))

    expect(wrapper.find('h1.nf-comments-sidebar__title').text()).toEqual('Comments')
  })

  test('should use the provided component', async () => {
    const context = { listReferenceComments: jest.fn().mockReturnValue([]) }
    const controller = { isActive: () => true, reference: 'ref-1' }

    const wrapper = mount(
      withSidebarsControllerContext(withResourceContext(<Sidebar component={Children} />, context), controller)
    )

    expect(wrapper.find('p').text()).toEqual('children')
  })

  test('renders correctly but return false for isActive', async () => {
    const context = { listReferenceComments: jest.fn().mockReturnValue([]) }
    const controller = { isActive: () => false }

    const wrapper = mount(withSidebarsControllerContext(withResourceContext(<Sidebar />, context), controller))

    expect(
      wrapper
        .find('#provider')
        .children()
        .first()
        .html()
    ).toBeNull()
  })
})
