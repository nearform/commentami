import React from 'react'
import { Resource, WebsocketService, buildWebsocketClient } from '@nearform/commentami-react-components'
import { Sidebar } from './sidebar'
import { Table } from './table'
import data from '../fixtures/data'
import { ErrorIndicator, LoadingIndicator } from './indicators'

export class TestWebsocketComments extends React.Component {
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
      <section className={this.props.sectionClassName}>
        <h1>Websockets</h1>
        <Resource resource="multiple-2" service={this.state.service}>
          <Table data={data} />
          <Sidebar />
          <LoadingIndicator />
          <ErrorIndicator />
        </Resource>
      </section>
    )
  }
}
