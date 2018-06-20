import React from 'react'
import { style } from 'typestyle'

import { NotificationsWrapper } from '@nearform/commentami-react-components'

const notificationsItemClass = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px 24px 16px 0',
  position: 'relative',
  borderTop: '1px solid #cecece',
  $nest: {
    span: {
      margin: '0 32px 0 0'
    },
    button: {
      position: 'absolute',
      top: '16px',
      right: 0,
      borderRadius: '50%'
    },
    a: {
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

const notificationsTitleClass = style({
  margin: '0 0 24px 0'
})

class NotificationItem extends React.Component {
  renderMessage(notification) {
    if (notification.type === 'mention') {
      return 'You have been mentioned in a comment'
    }

    return 'New comment in discussion...'
  }

  render() {
    return (
      <div className={notificationsItemClass}>
        <span>{this.renderMessage(this.props.notification)}</span>
        <div className={contentClass}>{this.props.notification.comment.content}</div>
        {this.props.notification.url && <a href={this.props.notification.url}>Go see it...</a>}
        <button onClick={this.props.onRemove}>X</button>
      </div>
    )
  }
}

class List extends React.Component {
  render() {
    if (!this.props.active && (!this.props.notifications || this.props.notifications.length === 0)) {
      return <div className={this.props.className}>Notifications service is not active.</div>
    }

    if (!this.props.notifications || this.props.notifications.length === 0) return null

    return (
      <div className={this.props.className}>
        <h2 className={notificationsTitleClass}>Notifications</h2>

        {this.props.notifications.map(notification => (
          <NotificationItem
            key={notification.comment.id}
            notification={notification}
            onRemove={() => this.props.removeNotificationFromList(notification)}
          />
        ))}
      </div>
    )
  }
}

export const NotificationsList = NotificationsWrapper(List)
