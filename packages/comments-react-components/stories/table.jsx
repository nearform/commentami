import React from 'react'
import { storiesOf } from '@storybook/react'

import { CommentableProvider } from '../src/components/CommentableProvider'

import sampleData from './data/sample'
import { Table } from './components/table'
import { sidebarClassName } from './components/styling'

storiesOf('Commentable/Table', module).add('Sample', () => (
  <CommentableProvider sidebarClassName={sidebarClassName}>
    <div style={{ margin: '30px' }}>
      <Table data={sampleData} columns={['name', 'gender', 'email', 'balance']} />
    </div>
  </CommentableProvider>
))
