import React from 'react'
import { storiesOf } from '@storybook/react'

import { CommentableProvider } from '../src/components/CommentableProvider'
import { CommentableBlock } from '../src/components/CommentableBlock'

import { CommentsInMemoryService } from './helpers/CommentsInMemoryService'

const commentService = CommentsInMemoryService()

storiesOf('Commentable/Readme', module).add('Sample', () => (
  <CommentableProvider resource="main" service={commentService}>
    <div style={{ marginLeft: '30px' }}>
      <CommentableBlock referenceId="comm-1">
        <h1>Text Title 1</h1>
      </CommentableBlock>
      <CommentableBlock referenceId="comm-2">
        <p>Paragraphs are separated by a blank line.</p>
      </CommentableBlock>
    </div>
  </CommentableProvider>
))
