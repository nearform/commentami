import PropTypes from 'prop-types'
import React from 'react'
import { childrenPropInterface } from './propInterfaces'

export const NotificationsContext = React.createContext('commentable')

export class Notifications extends React.Component {
  constructor(props) {
    super(props)

    // this.logger = this.props.logger

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
      if (!index === -1 && n.id === notification.id) {
        index === i
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
    this.unsubscribe = this.props.service.onUserNotification(this.props.userIdentifier, notification =>
      this.triggerNotification(notification)
    )

    setTimeout(() => {
      this.triggerNotification({
        id: 12344,
        comment: {},
        action: 'add'
      })
    }, 5000)
  }

  componentWillUpdate(nextProps) {
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

Notifications.displayName = 'Notifications'

// Notifications.defaultProps = {
//   logger: console
// }

Notifications.propTypes = {
  userIdentifier: PropTypes.string.isRequired,
  children: childrenPropInterface
}
