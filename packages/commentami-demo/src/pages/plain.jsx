import React from 'react'
import { style } from 'typestyle'
import { Resource, WebsocketService, buildWebsocketClient } from '@nearform/commentami-react-components'
import { Reference, SidebarsController, DeepLinkController } from '@nearform/commentami-react-components/dist/ui'
import { ErrorIndicator, LoadingIndicator } from '../components/indicators'
import { NotificationsList } from '../components/notifications/notificationsList'
import { Sidebar } from '../components/sidebar'
import { UserContext } from '../components/user'
import { pageClassName } from './index'

const notificationsListClass = style({
  position: 'absolute',
  top: '25px',
  right: '25px',
  background: '#ffffff',
  border: '1px solid #cecece',
  borderRadius: '4px',
  padding: '16px',
  zIndex: 1000
})

class WebsocketsCommentsEnabled extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      client: null,
      service: null
    }
  }

  async componentDidMount() {
    const client = buildWebsocketClient('ws://127.0.0.1:8080')
    await client.connect({ auth: { headers: { authorization: this.props.authorization } } })

    this.setState({
      client,
      service: WebsocketService(client)
    })
  }

  async componentWillUpdate(nextProps) {
    if (this.props.authorization !== nextProps.authorization) {
      await this.state.client.disconnect()

      const client = buildWebsocketClient('ws://127.0.0.1:8080')
      await client.connect({ auth: { headers: { authorization: this.props.authorization } } })

      this.setState({
        client,
        service: WebsocketService(client)
      })
    }
  }

  async componentWillUnmount() {
    await this.state.client.disconnect()
  }

  render() {
    return (
      <SidebarsController>
        <Resource resource="plain-1" service={this.state.service}>
          <LoadingIndicator />
          <ErrorIndicator />

          <Reference reference="header">
            <h1>Welcome!</h1>
          </Reference>

          <Reference reference="title">
            <h2>Each text in this page is commentable. Just double click on it.</h2>
          </Reference>

          <Reference reference="p1">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
              egestas pulvinar lectus, at porttitor elit sodales a. Sed nec augue luctus, elementum eros quis, euismod
              ante. Maecenas vitae tempus mauris. Curabitur vel laoreet diam. Morbi varius nisi vitae aliquam porta.
              Suspendisse potenti. Proin tincidunt massa dui, sed placerat neque gravida non. Aenean fringilla magna
              eget sollicitudin volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc malesuada
              cursus nisi eu vehicula. Proin vel libero euismod, lacinia odio eget, iaculis erat.
            </p>
          </Reference>
          <Reference reference="p2">
            <p>
              Proin et dolor metus. Ut leo est, pretium sed interdum ut, imperdiet nec est. Aenean porta elit non elit
              finibus finibus. Proin malesuada, lorem sit amet placerat congue, lectus ligula porta sem, at pellentesque
              ante urna eget turpis. Quisque volutpat neque eget rutrum volutpat. Cras dignissim, justo vitae porta
              viverra, quam nibh porta dolor, vel pharetra lacus ipsum non purus. Duis lacinia urna auctor, sodales
              mauris in, blandit orci. Aenean sagittis orci eu tempus feugiat. Pellentesque varius dolor iaculis,
              tincidunt lectus at, volutpat sapien. Sed nec feugiat dolor. Nulla accumsan pretium nulla, sit amet tempus
              nunc aliquet non. Nunc imperdiet imperdiet rhoncus.
            </p>
          </Reference>
          <Reference reference="p3">
            <p>
              Vestibulum at ipsum tempus, laoreet erat ac, congue lectus. Nulla non cursus augue. Cras mollis vel ipsum
              eu posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris
              vestibulum, elit quis auctor mollis, dui est tincidunt augue, in aliquet eros erat vitae libero. Nam sed
              finibus turpis. Praesent maximus libero sed nibh ornare ornare. Vestibulum commodo sem id metus placerat
              hendrerit.
            </p>
          </Reference>

          <Sidebar />
        </Resource>

        <Resource resource="another" service={this.state.service}>
          <LoadingIndicator />

          <Reference reference="header">
            <h1>This is now another provider!</h1>
          </Reference>

          <Reference reference="title">
            <h2>One sidebar will be shown at a time.</h2>
          </Reference>
          <Reference reference="p1">
            <p>
              Pellentesque luctus diam a justo fringilla porta. Praesent facilisis ante at risus vehicula molestie.
              Morbi laoreet orci et ligula euismod, at posuere risus laoreet. Nunc blandit eros in arcu laoreet commodo.
              Duis vitae lacus a risus ornare finibus at at tortor. Suspendisse libero mi, dictum in ipsum sed,
              condimentum mollis justo. Quisque blandit metus eu volutpat tincidunt. Proin quis leo dui. In dolor diam,
              pharetra sit amet purus ut, iaculis interdum elit. Cras et orci tempor, elementum massa ac, molestie
              augue. Vivamus iaculis dui et lorem porta vehicula.
            </p>
          </Reference>
          <Reference reference="p2">
            <p>
              Aliquam id dolor placerat, consectetur est in, convallis purus. Nam arcu nulla, porta non risus ut,
              ultricies condimentum lorem. Ut nec purus eu est elementum tincidunt. Ut id nulla nec nibh ornare pretium.
              Vestibulum porttitor vehicula iaculis. Etiam at dignissim orci, sed imperdiet nulla. Nam lorem mi, finibus
              a libero vel, fringilla dictum odio. Phasellus erat velit, eleifend eget imperdiet elementum, malesuada eu
              dolor. Nunc ac risus venenatis, aliquam lectus id, lobortis tortor. Pellentesque purus metus, varius vel
              accumsan ac, malesuada rutrum nulla. Quisque a sapien sed nulla vestibulum ornare.
            </p>
          </Reference>

          <Sidebar />
        </Resource>
      </SidebarsController>
    )
  }
}

export class PlainPage extends React.Component {
  render() {
    return (
      <DeepLinkController>
        <div className={pageClassName}>
          <NotificationsList className={notificationsListClass} />
          <UserContext.Consumer>
            {({ authorization }) => <WebsocketsCommentsEnabled authorization={authorization} />}
          </UserContext.Consumer>
        </div>
      </DeepLinkController>
    )
  }
}
