import { storiesOf } from '@storybook/react'
import React from 'react'
import { withReference } from '../src/components/core/HOC'
import { Resource } from '../src/components/core/Resource'
import { Sidebar } from '../src/components/ui/Sidebar'
import { SidebarsController, withSidebars } from '../src/components/ui/SidebarsController'
import { HttpService } from '../src/services/HttpService'
import { WebsocketService } from '../src/services/WebsocketService'
import { CommentsInMemoryService } from '../test/helpers/CommentsInMemoryService'
import { ErrorIndicator, LoadingIndicator } from './components/indicators'
import { CommentsMarker, Table } from './components/table'
import sampleData from './data/sample'

const commentsInMemoryService = CommentsInMemoryService()
const commentsHttpService = HttpService('http://localhost:8080/')
const commentsWebsocketService = WebsocketService('ws://localhost:8080/')

const CustomBlock = withSidebars(
  withReference(
    class extends React.Component {
      constructor(props) {
        super(props)

        this.rootRef = React.createRef()
        this.boundHandleClick = this.props.controller.handleClick.bind(null, {
          resource: this.props.commentami.resource,
          reference: this.props.reference,
          ref: this.rootRef,
          scope: 'marker'
        })
      }

      render() {
        let {
          children,
          activeClassName,
          controller,
          commentami: { hasComments, resource, reference }
        } = this.props
        const isActive = controller.isActive(resource, reference)

        if (!activeClassName) activeClassName = 'nf-commentami-reference--active'

        return (
          <div
            ref={this.rootRef}
            className={['nf-commentami-reference', isActive ? activeClassName : ''].filter(a => a).join(' ')}
            onClick={this.boundHandleClick}
          >
            {hasComments && <CommentsMarker />}
            {children}
          </div>
        )
      }
    }
  )
)

storiesOf('Commentable/Table', module)
  .add('InMemory Sample', () => (
    <SidebarsController>
      <Resource resource="sample-table-section" service={commentsInMemoryService}>
        <LoadingIndicator />

        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
        </div>
        <Sidebar />
      </Resource>
    </SidebarsController>
  ))
  .add('Fetch Sample', () => (
    <SidebarsController>
      <Resource resource="sample-table-section" service={commentsHttpService}>
        <LoadingIndicator />
        <ErrorIndicator />

        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} blockComponent={CustomBlock} />
        </div>
        <Sidebar />
      </Resource>
    </SidebarsController>
  ))
  .add('Nes Sample', () => (
    <SidebarsController>
      <Resource resource="sample-table-socket" service={commentsWebsocketService}>
        <LoadingIndicator />
        <ErrorIndicator />

        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} blockComponent={CustomBlock} />
        </div>
        <Sidebar />
      </Resource>
    </SidebarsController>
  ))
