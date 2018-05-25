import React from 'react'

import { storiesOf } from '@storybook/react'

import { CommentableProvider } from '../components/Commentable/Provider'
import { CommentableTextBlock } from '../components/Commentable/TextBlock'

import { CommentsBlock } from '../components/Commentable/CommentsBlock'
import { CommentIcon } from '../components/Commentable/CommentIcon'

storiesOf('Commentable', module).add('Sample Text', () => (
  <CommentableProvider>
    <div style={{ marginLeft: '20px' }}>
      <CommentableTextBlock blockId="comm-1">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentIcon />
        </div>
        <h1>TextBlock 1</h1>
      </CommentableTextBlock>
      <CommentableTextBlock blockId="comm-2">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentIcon />
        </div>
        <p>Paragraphs are separated by a blank line.</p>
      </CommentableTextBlock>
      <CommentableTextBlock blockId="comm-3">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentIcon />
        </div>

        <p>
          2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and{' '}
          <code>monospace</code>. Itemized lists look like:
        </p>
      </CommentableTextBlock>
      <CommentableTextBlock blockId="comm-4">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentIcon />
        </div>
        <ul>
          <li>this one</li>
          <li>that one</li>
          <li>the other one</li>
        </ul>
      </CommentableTextBlock>
      <CommentableTextBlock blockId="comm-5">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentIcon />
        </div>
        <blockquote>
          <p>Block quotes are written like so.</p>
          <p>They can span multiple paragraphs, if you like.</p>
        </blockquote>
      </CommentableTextBlock>
      <CommentableTextBlock blockId="comm-6">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentIcon />
        </div>
        <p>
          Note that --- not considering the asterisk --- the actual text content
          starts at 4-columns in.
        </p>
      </CommentableTextBlock>
    </div>
    <CommentsBlock />
  </CommentableProvider>
))
