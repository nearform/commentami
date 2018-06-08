import { storiesOf } from '@storybook/react'
import React from 'react'
import { commentableBlock } from '../src/components/core/CommentableComponents'
import { Resource } from '../src/components/core/Resource'
import { Sidebar } from '../src/components/ui/Sidebar'
import { commentableWithController, SidebarsController } from '../src/components/ui/SidebarsController'
import { CommentsFetchService } from '../src/services/CommentsFetchService'
import { CommentsNesService } from '../src/services/CommentsNesService'
import { CommentsInMemoryService } from '../test/helpers/CommentsInMemoryService'
import { CommentsMarker, Table } from './components/table'
import sampleData from './data/sample'

const commentsInMemoryService = CommentsInMemoryService()
const commentsFetchService = CommentsFetchService('http://localhost:8080/')
const commentsNesService = CommentsNesService('ws://localhost:8080/')

const CustomBlock = commentableWithController(
  commentableBlock(
    class extends React.Component {
      constructor(props) {
        super(props)

        this.rootRef = React.createRef()
        this.boundHandleClick = this.props.controller.handleClick.bind(null, {
          resource: this.props.resource,
          reference: this.props.reference,
          ref: this.rootRef,
          scope: 'marker'
        })
      }

      render() {
        let { children, activeClassName, controller, hasComments, resource, reference } = this.props
        const isActive = controller.isActive(resource, reference)

        if (!activeClassName) activeClassName = 'nf-comments-block--active'

        return (
          <div
            ref={this.rootRef}
            className={['nf-comments-block', isActive ? activeClassName : ''].filter(a => a).join(' ')}
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
        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
        </div>
        <Sidebar />
      </Resource>
    </SidebarsController>
  ))
  .add('Fetch Sample', () => (
    <SidebarsController>
      <Resource resource="sample-table-section" service={commentsFetchService}>
        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} blockComponent={CustomBlock} />
        </div>
        <Sidebar />
      </Resource>
    </SidebarsController>
  ))
  .add('Nes Sample', () => (
    <SidebarsController>
      <Resource resource="sample-table-socket" service={commentsNesService}>
        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} blockComponent={CustomBlock} />
        </div>
        <Sidebar />
      </Resource>
    </SidebarsController>
  ))
