import React from 'react'
import { style, cssRaw } from 'typestyle'
import { WebsocketService, buildWebsocketClient, NotificationsProvider } from 'notifications-react-components'

import { UserContext } from './user'

cssRaw(`
.notification-widget {
  z-index: 10;
  margin: 10px;
}

.notifications-box {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  width: 40px;
  height: 30px;
  background-color: #ebebeb;
  border: 1px solid #424242;
  color: #424242;
  font-weight: bold;
  cursor: pointer;
}

.notifications-list {
  box-sizing: border-box;
  position: absolute;
  top: 65px;
  font-family: sans-serif;
  width: 250px;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  border: 1px solid darkgray;
  background-color: #ebebeb;
  color: #424242;
  padding: 0;
}

.notifications-list h3{
  box-sizing: border-box;
  margin: 1px 0 0 1px;
  padding: 2px;
  padding-bottom: 5px;
  border-radius: 3px 3px 0 0;
  background-color: #ebebeb;
  border-bottom: 1px solid lightgray;
}

.notifications-list p{
  padding: 2px;
}

.notifications-list .notifications-list-item {
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid lightgray;
  padding: 5px;
}
`)

const notificationsItemClass = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px 24px 16px 0',
  position: 'relative',
  borderTop: '1px solid #cecece',
  $nest: {
    span: {
      margin: '0 32px 0 0',
      paddingLeft: '8px',
      fontSize: '12px'
    },
    button: {
      position: 'absolute',
      top: '16px',
      right: '4px',
      borderRadius: '50%'
    },
    a: {
      paddingLeft: '8px',
      margin: '8px 0'
    }
  }
})

const contentClass = style({
  backgroundColor: '#cecece',
  fontStyle: 'italic',
  margin: '16px 32px 0 0',
  padding: '8px'
})

class NotificationItem extends React.Component {
  renderMessage(notification) {
    if (notification.notify.type === 'mention') {
      return 'You have been mentioned in a comment'
    }

    return 'New comment in discussion...'
  }

  render() {
    return (
      <div className={notificationsItemClass}>
        <span>{this.renderMessage(this.props.notification)}</span>
        <div className={contentClass}>{this.props.notification.notify.comment.content}</div>
        {this.props.notification.notify.url && <a href={this.props.notification.notify.url}>Go see it...</a>}
        <button onClick={this.props.onRemove}>X</button>
      </div>
    )
  }
}

class NotificationsBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      service: null
    }
  }

  async componentDidMount() {
    try {
      const client = buildWebsocketClient('ws://127.0.0.1:8482')
      await client.connect()

      this.setState({
        service: WebsocketService(client)
      })
    } catch (e) {
      this.props.logger && this.props.logger.error(e)
    }
  }

  render() {
    return (
      <NotificationsProvider
        userIdentifier={this.props.user}
        service={this.state.service}
        NotificationItem={NotificationItem}
      >
        {this.props.children}
      </NotificationsProvider>
    )
  }
}

export const UseNotifications = ({ children }) => {
  return (
    <UserContext.Consumer>
      {({ selected, authorization }) => (
        <NotificationsBuilder children={children} user={selected} authorization={authorization} />
      )}
    </UserContext.Consumer>
  )
}
