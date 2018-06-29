import React from 'react'
import { WebsocketService, buildWebsocketClient } from '@nearform/commentami-react-components'
import { UserContext } from '../user'
import { NotificationsProvider } from './NotificationsProvider'

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
      <NotificationsProvider userIdentifier={this.props.user} service={this.state.service}>
        {this.props.children}
      </NotificationsProvider>
    )
  }
}

export const NotificationsSetup = ({ children }) => {
  return (
    <UserContext.Consumer>
      {({ selected, authorization }) => (
        <NotificationsBuilder children={children} user={selected} authorization={authorization} />
      )}
    </UserContext.Consumer>
  )
}
