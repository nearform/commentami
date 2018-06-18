import { em, rem, viewWidth } from 'csx'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { style } from 'typestyle'
import { debugClassName } from '../styling/environment'
import { UserContext } from './user'
import {
  WebsocketService,
  buildWebsocketClient,
  Notifications,
  NotificationsContext
} from '@nearform/commentami-react-components'

const headerClassName = style(debugClassName('header'), {
  backgroundColor: '#DA3338'
})

const headerNavClassName = style(debugClassName('header-nav'), {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  width: viewWidth(80),
  maxWidth: rem(100),
  height: rem(6),
  margin: '0 auto'
})

const headerTitleClassName = style(debugClassName('header-title'), {
  display: 'inline-block',
  color: 'white',
  fontWeight: 'bold',
  margin: 0,
  padding: `${rem(1)} ${rem(2)}`,
  fontSize: em(2),
  flex: 1,
  $nest: {
    '&:hover, &:hover:not(.active)': {
      color: '#F0D030'
    }
  }
})

const headerLinkClassName = style(debugClassName('header-link'), {
  display: 'inline-flex',
  color: 'white',
  fontWeight: 'bold',
  padding: `${rem(1)} ${rem(2)}`,
  height: '75%',
  alignItems: 'center',
  transition: 'all 0.2s ease',
  borderTop: `${rem(0.2)} solid transparent`,
  $nest: {
    '&:hover, &.active': {
      color: '#DA3338',
      backgroundColor: 'white',
      borderTopColor: `#C0C0C0`
    }
  }
})

const selectUserClass = style(debugClassName('header-select-user'), {
  display: 'inline-flex',
  marginBottom: '10px'
})

class SelectUser extends React.Component {
  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  render() {
    return (
      <UserContext.Consumer>
        {({ selected, selectUser }) => (
          <select value={selected} onChange={event => selectUser(event.target.value)} className={selectUserClass}>
            <option value="filippo">Filippo</option>
            <option value="davide">Davide</option>
            <option value="paolo">Paolo</option>
            <option value="test">Test</option>
          </select>
        )}
      </UserContext.Consumer>
    )
  }
}

class NotificationWillNeverEnd extends React.Component {
  componentWillUpdate(nextProps) {
    if (this.props.notifications.length < nextProps.notifications.length) {
      console.log('this.props.notifications', this.props.notifications)
      console.log('nextProps.notifications', nextProps.notifications)
    }
  }

  render() {
    const { notifications, removeNotificationFromList } = this.props

    return <div>{notifications.length}</div>
  }
}

class DajeNotifications extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  async componentDidMount() {
    const client = buildWebsocketClient('ws://127.0.0.1:8080')
    await client.connect({ auth: { headers: { authorization: this.props.authorization } } })

    this.setState({
      service: WebsocketService(client)
    })
  }

  render() {
    if (!this.state.service) {
      return null
    }

    return (
      <Notifications userIdentifier={this.props.user} service={this.state.service}>
        <NotificationsContext.Consumer>
          {({ notifications, removeNotificationFromList }) => (
            <NotificationWillNeverEnd
              notifications={notifications}
              removeNotificationFromList={removeNotificationFromList}
            />
          )}
        </NotificationsContext.Consumer>
      </Notifications>
    )
  }
}

class NotificationsBox extends React.Component {
  render() {
    return (
      <UserContext.Consumer>
        {({ selected, authorization }) => <DajeNotifications user={selected} authorization={authorization} />}
      </UserContext.Consumer>
    )
  }
}

export function Header() {
  return (
    <header className={headerClassName}>
      <nav className={headerNavClassName}>
        <NavLink to="/" className={headerTitleClassName}>
          Commentami Demo
        </NavLink>

        <NotificationsBox />

        <NavLink to="/plain" className={headerLinkClassName}>
          Plain Text
        </NavLink>
        <NavLink to="/markdown" className={headerLinkClassName}>
          Markdown
        </NavLink>
        <NavLink to="/table" className={headerLinkClassName}>
          Table
        </NavLink>
        <NavLink to="/multiple" className={headerLinkClassName}>
          Multiple
        </NavLink>

        <SelectUser />
      </nav>
    </header>
  )
}
