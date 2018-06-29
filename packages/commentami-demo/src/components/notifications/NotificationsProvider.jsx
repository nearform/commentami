import PropTypes from 'prop-types'
import React from 'react'
import { childrenPropInterface } from '@nearform/commentami-react-components'

export const NotificationsContext = React.createContext('notification-provider')

export class NotificationsProvider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notifications: [],
      removeNotificationFromList: this.removeNotificationFromList.bind(this),
      active: !!props.service,
      service: props.service
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
      return n.id === notification.id
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
    if (!this.state.service) return

    try {
      this.unsubscribe = await this.state.service.onUserNotification(this.props.userIdentifier, notification =>
        this.triggerNotification(notification)
      )

      this.setState({
        active: true
      })
    } catch (e) {
      this.setState({
        service: null,
        active: false
      })
    }
  }

  async componentWillUpdate(nextProps, nextState) {
    if (this.state.service && !nextProps.service) {
      this.unsubscribe && (await this.unsubscribe())

      this.setState({
        active: false,
        service: null
      })

      return
    }

    if (nextProps.service && (!this.unsubscribe || this.props.userIdentifier !== nextProps.userIdentifier)) {
      this.unsubscribe && (await this.unsubscribe())

      try {
        this.unsubscribe = await nextProps.service.onUserNotification(nextProps.userIdentifier, notification =>
          this.triggerNotification(notification)
        )

        this.setState({
          notifications: [],
          active: true,
          service: nextProps.service
        })
      } catch (e) {
        if (!!nextState.active || !!nextState.service) {
          this.setState({
            active: false,
            service: null
          })
        }
      }
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

NotificationsProvider.displayName = 'NotificationsProvider'

NotificationsProvider.propTypes = {
  userIdentifier: PropTypes.string.isRequired,
  service: PropTypes.object,
  children: childrenPropInterface
}
