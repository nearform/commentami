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
    const index = notifications.findIndex(n => {
      return n.comment.id === notification.comment.id
    })

    if (index === -1) {
      return
    }

    notifications.splice(index, 1)

    this.setState({
      notifications
    })
  }

  async componentDidMount() {
    if (!this.props.service) return

    this.unsubscribe = await this.props.service.onUserNotification(this.props.userIdentifier, notification =>
      this.triggerNotification(notification)
    )
  }

  async componentWillUpdate(nextProps) {
    if (!nextProps.service) return

    if (!this.unsubscribe || this.props.userIdentifier !== nextProps.userIdentifier) {
      this.unsubscribe && (await this.unsubscribe())

      this.unsubscribe = await nextProps.service.onUserNotification(nextProps.userIdentifier, notification =>
        this.triggerNotification(notification)
      )
    }
  }

  async componentWillUnmount() {
    this.unsubscribe && (await this.unsubscribe())
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
