import React from 'react'
import { NotificationsWrapper } from '@nearform/commentami-react-components'

class Box extends React.Component {
  render() {
    const { notifications, active } = this.props

    return <div className={this.props.className}>{!active ? '!' : (notifications && notifications.length) || 0}</div>
  }
}

export const NotificationsBox = NotificationsWrapper(Box)
