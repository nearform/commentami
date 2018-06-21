import { storiesOf } from '@storybook/react'
import React from 'react'
import { withReference } from '../src/components/core/HOC'
import { Sidebar } from '../src/components/ui/Sidebar'
import { withSidebars } from '../src/components/ui/SidebarsController'
import { HttpService } from '../src/services/HttpService'
import { WebsocketService } from '../src/services/WebsocketService'
import { CommentsInMemoryService } from '../test/helpers/CommentsInMemoryService'
import { ErrorIndicator, LoadingIndicator } from './components/indicators'
import { CommentsMarker, Table } from './components/table'
import sampleData from './data/sample'
import { Commentami } from '../src/components/ui/Commentami'

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
    <Commentami
      resource="sample-table-section"
      service={commentsInMemoryService}
      LoadingIndicator={LoadingIndicator}
      Sidebar={Sidebar}
    >
      <div style={{ margin: '30px' }}>
        <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
      </div>
    </Commentami>
  ))
  .add('Fetch Sample', () => (
    <Commentami
      resource="sample-table-http"
      service={commentsHttpService}
      LoadingIndicator={LoadingIndicator}
      ErrorIndicator={ErrorIndicator}
      Sidebar={Sidebar}
    >
      <div style={{ margin: '30px' }}>
        <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} blockComponent={CustomBlock} />
      </div>
    </Commentami>
  ))
  .add('Nes Sample', () => (
    <Commentami
      resource="sample-table-socket"
      service={commentsWebsocketService}
      LoadingIndicator={LoadingIndicator}
      ErrorIndicator={ErrorIndicator}
      Sidebar={Sidebar}
    >
      <div style={{ margin: '30px' }}>
        <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} blockComponent={CustomBlock} />
      </div>
    </Commentami>
  ))
