import React from 'react'
import { storiesOf } from '@storybook/react'

import sampleData from './data/sample'
import { CommentableProvider } from '../src/components/Commentable/Provider'
import { CommentsBlock } from '../src/components/Commentable/CommentsBlock'
import { NewCommentPopUp } from '../src/components/Commentable/NewCommentPopUp'

import { Table } from './components/table'

storiesOf('Commentable/Table', module).add('Sample', () => (
  <CommentableProvider>
    <NewCommentPopUp />
    <div style={{ marginLeft: '20px' }}>
      <Table
        data={sampleData}
        columns={['name', 'gender', 'email', 'balance']}
      />
    </div>
    <CommentsBlock />
  </CommentableProvider>
))
