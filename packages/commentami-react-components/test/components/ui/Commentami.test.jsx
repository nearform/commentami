import { mount } from 'enzyme'
import React from 'react'
import { Commentami } from '../../../src/components/ui/Commentami'
import { Reference } from '../../../src/components/ui/Reference'
import { CommentsInMemoryService } from '../../helpers/CommentsInMemoryService'

describe('Commentami', () => {
  test('Should render correctly the default values', () => {
    const service = new CommentsInMemoryService()
    const wrapper = mount(
      <Commentami resource="res-1" service={service}>
        <Reference reference="ref-1">
          <div />
        </Reference>,
      </Commentami>
    )

    expect(wrapper.find('DeepLinkController').length).toEqual(1)
    expect(wrapper.find('SidebarsController').length).toEqual(1)
    expect(wrapper.find('Resource').length).toEqual(1)
    expect(wrapper.find('Resource').props().resource).toBe('res-1')
    expect(wrapper.find('Resource').props().logger).toBeDefined()
    expect(wrapper.find('Resource').props().service).toBeDefined()
  })

  test('Should render correctly the customizations', () => {
    const service = new CommentsInMemoryService()

    const Sidebar = props => <div>{props.text}</div>
    const LoadingIndicator = props => <div>{props.text}</div>
    const ErrorIndicator = props => <div>{props.text}</div>
    const wrapper = mount(
      <Commentami
        resource="res-1"
        service={service}
        Sidebar={Sidebar}
        sidebarProps={{ text: 'sidebar' }}
        LoadingIndicator={LoadingIndicator}
        loadingIndicatorProps={{ text: 'loading' }}
        ErrorIndicator={ErrorIndicator}
        errorIndicatorProps={{ text: 'error' }}
      >
        <Reference reference="ref-1">
          <div />
        </Reference>,
      </Commentami>
    )

    expect(wrapper.find('Sidebar').length).toEqual(1)
    expect(wrapper.find('Sidebar').text()).toBe('sidebar')
    expect(wrapper.find('LoadingIndicator').length).toEqual(1)
    expect(wrapper.find('LoadingIndicator').text()).toBe('loading')
    expect(wrapper.find('ErrorIndicator').length).toEqual(1)
    expect(wrapper.find('ErrorIndicator').text()).toBe('error')
  })
})
