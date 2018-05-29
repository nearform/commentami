import React from 'react'
import { storiesOf } from '@storybook/react'

import { CommentsInMemoryService } from '../test/helpers/CommentsInMemoryService'
import { CommentsFetchService } from '../src/services/CommentsFetchService'
import { CommentableProvider } from '../src/components/CommentableProvider'

import sampleData from './data/sample'
import { Table } from './components/table'
import { sidebarClassName } from './components/styling'

const commentsInMemoryService = CommentsInMemoryService()
const commentsFetchService = CommentsFetchService('http://localhost:8080/')

storiesOf('Commentable/Table', module)
  .add('InMemory Sample', () => (
    <CommentableProvider resource="sample-table-section" service={commentsInMemoryService} sidebarClassName={sidebarClassName}>
      <div style={{ margin: '30px' }}>
        <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
      </div>
    </CommentableProvider>
  ))
  .add('Fetch Sample', () => (
    <CommentableProvider resource="sample-table-section" service={commentsFetchService} sidebarClassName={sidebarClassName}>
      <div style={{ margin: '30px' }}>
        <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
      </div>
    </CommentableProvider>
  ))
