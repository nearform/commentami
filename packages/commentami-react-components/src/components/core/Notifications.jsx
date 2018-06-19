import PropTypes from 'prop-types'
import React from 'react'
import { childrenPropInterface } from './propInterfaces'

export const NotificationsContext = React.createContext('commentable')

export class Notifications extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notifications: [],
      removeNotificationFromList: this.removeNotificationFromList.bind(this)
    }
  }

  triggerNotification(notification) {
    this.setState({
      notifications: this.state.notifications.concat(notification)
    })
  }

  removeNotificationFromList(notification) {
    let notifications = this.state.notifications
    let index = -1

    notifications.forEach((n, i) => {
      if (index === -1 && n.comment.id === notification.comment.id) {
        index = i
      }
    })

    if (index === -1) {
      return
    }

    notifications.splice(index, 1)

    this.setState({
      notifications
    })
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.triggerNotification({
    //     comment: {
    //       id: 1235,
    //       resource: 'whatever',
    //       reference: 'whatever',
    //       content: 'lorm ipsum dolet ... @test ...',
    //       author: {
    //         id: 1234,
    //         firstName: 'Test',
    //         lastName: 'Test',
    //         username: 'test'
    //       },
    //       mentions: [{ id: 22, firstName: 'Filippo', lastName: 'Filippo', username: 'filippo' }]
    //     },
    //     type: 'mention',
    //     link: 'http://google.gom'
    //   })
    // }, 500)

    // setTimeout(() => {
    //   this.triggerNotification({
    //     comment: {
    //       id: 1234,
    //       resource: 'whatever 2',
    //       reference: 'whatever 2',
    //       content: 'lorm ipsum dolet ... 2',
    //       author: {
    //         id: 1234,
    //         firstName: 'Test',
    //         lastName: 'Test',
    //         username: 'test'
    //       },
    //       mentions: []
    //     },
    //     type: 'respoonse',
    //     link: 'http://google.gom'
    //   })
    // }, 1500)

    if (!this.props.service) return

    this.unsubscribe = this.props.service.onUserNotification(this.props.userIdentifier, notification =>
      this.triggerNotification(notification)
    )
  }

  componentWillUpdate(nextProps) {
    if (!this.props.service) return

    if (this.props.userIdentifier !== nextProps.userIdentifier) {
      this.unsubscribe && this.unsubscribe()

      this.unsubscribe = this.props.service.onUserNotification(nextProps.userIdentifier, notification =>
        this.triggerNotification(notification)
      )
    }
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  render() {
    return <NotificationsContext.Provider value={this.state} children={this.props.children} />
  }
}

export const NotificationsWrapper = Component => {
  return class NotificationsWrappedComponent extends React.Component {
    render() {
      return (
        <NotificationsContext.Consumer>
          {notificationsProps => <Component {...this.props} {...notificationsProps} />}
        </NotificationsContext.Consumer>
      )
    }
  }
}

Notifications.displayName = 'Notifications'

Notifications.propTypes = {
  userIdentifier: PropTypes.string.isRequired,
  service: PropTypes.object,
  children: childrenPropInterface
}
