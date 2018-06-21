import React from 'react'
import { WebsocketService, buildWebsocketClient, Notifications } from '@nearform/commentami-react-components'
import { UserContext } from '../user'

class NotificationsBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      service: null
    }
  }

  async componentDidMount() {
    try {
      const client = buildWebsocketClient('ws://127.0.0.1:8080')
      await client.connect({ auth: { headers: { authorization: this.props.authorization } } })

      this.setState({
        service: WebsocketService(client)
      })
    } catch (e) {
      this.props.logger && this.props.logger.error(e)
    }
  }

  render() {
    return (
      <Notifications userIdentifier={this.props.user} service={this.state.service}>
        {this.props.children}
      </Notifications>
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
