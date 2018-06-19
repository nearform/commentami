import { mount } from 'enzyme'
import React from 'react'
import { Notifications } from '../../../src/components/core/Notifications'
import { delay } from '../../helpers/context'

const mockWebSocketService = () => {
  return {
    onUserNotification: jest.fn()
  }
}

describe('Notifications', () => {
  let wrapper
  let service

  beforeEach(() => {
    service = mockWebSocketService()
    wrapper = mount(
      <Notifications userIdentifier="test" service={service}>
        <div />
      </Notifications>
    )
  })

  describe('lifecycle', () => {
    test('when the component is mounted it should subscribe to the user notifications', async () => {
      await delay()

      expect(service.onUserNotification).toHaveBeenCalled()
      wrapper.unmount()
    })

    test('when the component is updated it should refresh the comment list', async () => {
      service.onUserNotification.mockClear()
      wrapper.setProps({ userIdentifier: 'test2' })
      await delay()

      expect(service.onUserNotification).toHaveBeenCalled()
    })
  })
})
