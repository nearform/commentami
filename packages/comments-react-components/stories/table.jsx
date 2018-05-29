import React from 'react'
import { storiesOf } from '@storybook/react'

import { CommentsInMemoryService } from './helpers/CommentsInMemoryService'
import { CommentableProvider } from '../src/components/CommentableProvider'

import sampleData from './data/sample'
import { Table } from './components/table'
import { sidebarClassName } from './components/styling'

const commentService = CommentsInMemoryService()

storiesOf('Commentable/Table', module).add('Sample', () => (
  <CommentableProvider resource="sample-table-section" sidebarClassName={sidebarClassName} service={commentService}>
    <div style={{ margin: '30px' }}>
      <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
    </div>
  </CommentableProvider>
))
