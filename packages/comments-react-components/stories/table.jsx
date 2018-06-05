import { storiesOf } from '@storybook/react'
import React from 'react'
import { CommentableProvider } from '../src/components/core/CommentableProvider'
import { CommentableSidebar } from '../src/components/ui/CommentableSidebar'
import { CommentableSidebarsContainer } from '../src/components/ui/CommentableSidebarsContainer'
import { CommentsFetchService } from '../src/services/CommentsFetchService'
import { CommentsInMemoryService } from '../test/helpers/CommentsInMemoryService'
import { Sidebar } from './components/sidebar'
import { Table } from './components/table'
import sampleData from './data/sample'

const commentsInMemoryService = CommentsInMemoryService()
const commentsFetchService = CommentsFetchService('http://localhost:8080/')

storiesOf('Commentable/Table', module)
  .add('InMemory Sample', () => (
    <CommentableSidebarsContainer>
      <CommentableProvider resource="sample-table-section" service={commentsInMemoryService}>
        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
        </div>
        <CommentableSidebar component={Sidebar} />
      </CommentableProvider>
    </CommentableSidebarsContainer>
  ))
  .add('Fetch Sample', () => (
    <CommentableSidebarsContainer>
      <CommentableProvider resource="sample-table-section" service={commentsFetchService}>
        <div style={{ margin: '30px' }}>
          <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
        </div>
        <CommentableSidebar component={Sidebar} />
      </CommentableProvider>
    </CommentableSidebarsContainer>
  ))
