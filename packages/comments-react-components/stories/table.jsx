import { storiesOf } from '@storybook/react'
import React from 'react'
import { CommentableProvider } from '../src/components/core/CommentableProvider'
import { CommentableCommentsList } from '../src/components/ui/CommentableCommentsList'
import { CommentableController } from '../src/components/ui/CommentableController'
import { CommentableIcon } from '../src/components/ui/CommentableIcon'
import { CommentableNewForm } from '../src/components/ui/CommentableNewForm'
import { CommentableSidebar } from '../src/components/ui/CommentableSidebar'
import { CommentsFetchService } from '../src/services/CommentsFetchService'
import { CommentsNesService } from '../src/services/CommentsNesService'
import { CommentsInMemoryService } from '../test/helpers/CommentsInMemoryService'
import { Table } from './components/table'
import sampleData from './data/sample'

const commentsInMemoryService = CommentsInMemoryService()
const commentsFetchService = CommentsFetchService('http://localhost:8080/')
const commentsNesService = CommentsNesService('ws://localhost:8080/')

export class Sidebar extends React.Component {
  constructor(props) {
    super(props)

    this.rootRef = React.createRef()
    this.boundHandleClose = this.handleClose.bind(this)
  }

  handleClose(ev) {
    ev.preventDefault()
    const payload = { resource: this.props.controller.resource, reference: this.props.controller.reference, ref: this.rootRef, scope: 'sidebar-close' }

    if (typeof this.props.controller.handleClick === 'function') this.props.controller.handleClick(payload, ev)
  }

  // Icon from https://www.brandeps.com/icon/
  render() {
    const reference = this.props.controller.reference

    return (
      <div ref={this.rootRef} className="nf-sidebar">
        <header className="nf-sidebar__header">
          <h1 className="nf-sidebar__title">{this.props.title || 'Comments'}</h1>
          <a className="nf-sidebar__close" href="#" onClick={this.boundHandleClose}>
            <CommentableIcon
              viewBox="0 0 96 96"
              path="M48,16.3c-17.5,0-31.7,14.2-31.7,31.7S30.5,79.7,48,79.7S79.7,65.5,79.7,48S65.5,16.3,48,16.3z M63.8,59.4l-4.5,4.5L48,52.5L36.6,63.8l-4.5-4.5L43.5,48L32.2,36.6l4.5-4.5L48,43.5l11.4-11.4l4.5,4.5L52.5,48L63.8,59.4z"
            />
          </a>
        </header>
        <CommentableCommentsList reference={reference} />
        <CommentableNewForm reference={reference} />
      </div>
    )
  }
}

storiesOf('Commentable/Table', module)
  .add('InMemory Sample', () => (
    <CommentableController>
      <CommentableProvider resource="sample-table-section" service={commentsInMemoryService}>
        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
        </div>
        <CommentableSidebar />
      </CommentableProvider>
    </CommentableController>
  ))
  .add('Fetch Sample', () => (
    <CommentableController>
      <CommentableProvider resource="sample-table-section" service={commentsFetchService}>
        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
        </div>
        <CommentableSidebar />
      </CommentableProvider>
    </CommentableController>
  ))
  .add('Nes Sample', () => (
    <CommentableController>
      <CommentableProvider resource="sample-table-socket" service={commentsNesService}>
        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
        </div>
      </CommentableProvider>
    </CommentableController>
  ))
