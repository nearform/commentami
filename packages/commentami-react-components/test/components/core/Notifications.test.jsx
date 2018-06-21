import { mount } from 'enzyme'
import React from 'react'
import { Notifications, NotificationsWrapper, NotificationsContext } from '../../../src/components/core/Notifications'
import { delay } from '../../helpers/context'

function PropsChildren(props) {
  return <span>test</span>
}

const mockWebSocketService = ({ subscriptionError = false } = {}) => {
  let called = 0
  let user
  let callback

  return {
    onUserNotification: async (u, c) => {
      called++

      if (subscriptionError) {
        throw new Error('Subscription error')
      }

      user = u
      callback = c

      return async () => {}
    },
    getCalled: () => {
      return called
    },
    getUser: () => {
      return user
    },
    getCallback: () => {
      return callback
    }
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

      expect(service.getCalled()).toEqual(1)
      wrapper.unmount()
    })

    test('When a new commiunication comes from the socket, the callback is called and the status updated', async () => {
      await delay()

      service.getCallback()({ id: 'hello' })
      expect(wrapper.state().notifications).toEqual([{ id: 'hello' }])
      expect(wrapper.state().active).toEqual(true)

      wrapper.setProps({ userIdentifier: 'test2' })
      await delay()

      service.getCallback()({ id: 'hello2' })
      expect(wrapper.state().notifications).toEqual([{ id: 'hello2' }])
      expect(wrapper.state().active).toEqual(true)

      wrapper.unmount()
    })

    test('When updating props with no servie the status should be inactive', async () => {
      wrapper.setProps({ service: undefined })
      await delay()

      expect(wrapper.state().active).toEqual(false)

      wrapper.unmount()
    })

    test('When passing no servie the status should be inactive', async () => {
      wrapper = mount(
        <Notifications userIdentifier="test">
          <div />
        </Notifications>
      )

      await delay()

      expect(wrapper.state().active).toEqual(false)
      wrapper.unmount()
    })

    test('a notification can be removed', async () => {
      await delay()

      service.getCallback()({ comment: { id: 'hello' } })
      expect(wrapper.state().notifications).toEqual([{ comment: { id: 'hello' } }])
      expect(wrapper.state().active).toEqual(true)

      wrapper.state().removeNotificationFromList({ comment: { id: 'hello' } })
      await delay()

      expect(wrapper.state().notifications).toEqual([])
      expect(wrapper.state().active).toEqual(true)

      wrapper.unmount()
    })

    test('a notification will not be removed if not present', async () => {
      await delay()

      service.getCallback()({ comment: { id: 'hello' } })
      expect(wrapper.state().notifications).toEqual([{ comment: { id: 'hello' } }])
      expect(wrapper.state().active).toEqual(true)

      wrapper.state().removeNotificationFromList({ comment: { id: 'hello-not-there' } })
      await delay()

      expect(wrapper.state().notifications).toEqual([{ comment: { id: 'hello' } }])
      expect(wrapper.state().active).toEqual(true)

      wrapper.unmount()
    })

    test('when the component is updated it should refresh the comment list', async () => {
      wrapper.setProps({ userIdentifier: 'test2' })
      await delay()

      expect(service.getCalled()).toEqual(2)
    })

    test('when there is an error subscribing the active flag is false', async () => {
      service = mockWebSocketService({ subscriptionError: true })
      wrapper = mount(
        <Notifications userIdentifier="test" service={service}>
          <div />
        </Notifications>
      )
      await delay()

      expect(service.getCalled()).toEqual(2)
      expect(wrapper.state().active).toEqual(false)
    })

    test.only('wrapping into a NotificationsWrapper', async () => {
      const NotificationsComponent = NotificationsWrapper(PropsChildren)

      mount(
        <div>
          <NotificationsContext.Provider value={{ test: 'test' }}>
            <NotificationsComponent />
          </NotificationsContext.Provider>
        </div>
      )
    })
  })
})
