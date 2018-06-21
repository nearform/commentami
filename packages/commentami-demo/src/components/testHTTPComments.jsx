import React from 'react'
import { Resource, HttpService } from '@nearform/commentami-react-components'
import { rem } from 'csx'
import { style } from 'typestyle'
import { Sidebar } from './sidebar'
import data from '../fixtures/data'
import { ErrorIndicator, LoadingIndicator } from './indicators'
import { Table } from './table'
import { debugClassName } from '../styling/environment'

const sectionClassName = style(debugClassName('table'), {
  marginTop: rem(3),
  position: 'relative'
})

export class TestHTTPComments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      client: null,
      service: null
    }
  }

  async componentDidMount() {
    this.setState({
      service: HttpService('http://localhost:8080/', this.props.authorization)
    })
  }

  async componentWillUpdate(nextProps) {
    if (this.props.authorization !== nextProps.authorization) {
      this.setState({
        service: HttpService('http://localhost:8080/', nextProps.authorization)
      })
    }
  }

  render() {
    return (
      <section className={sectionClassName}>
        <h1>HTTP</h1>
        <Resource resource="multiple-3" service={this.state.service}>
          <Table data={data} />
          <Sidebar />
          <LoadingIndicator />
          <ErrorIndicator />
        </Resource>
      </section>
    )
  }
}
