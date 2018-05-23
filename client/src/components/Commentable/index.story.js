import React from 'react'

import { storiesOf } from '@storybook/react'
import {
  CommentableProvider,
  CommentableIcon,
  CommentableTextBlock,
  CommentableCommentsBlock
} from '.'

storiesOf('Commentable', module).add('Sample Text', () => (
  <CommentableProvider>
    <div style={{ marginLeft: '20px' }}>
      <CommentableTextBlock commentableId="comm-1">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentableIcon />
        </div>
        <h1>TextBlock 1</h1>
      </CommentableTextBlock>
      <CommentableTextBlock commentableId="comm-2">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentableIcon />
        </div>
        <p>Paragraphs are separated by a blank line.</p>
      </CommentableTextBlock>
      <CommentableTextBlock commentableId="comm-3">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentableIcon />
        </div>

        <p>
          2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and{' '}
          <code>monospace</code>. Itemized lists look like:
        </p>
      </CommentableTextBlock>
      <CommentableTextBlock commentableId="comm-4">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentableIcon />
        </div>
        <ul>
          <li>this one</li>
          <li>that one</li>
          <li>the other one</li>
        </ul>
      </CommentableTextBlock>
      <CommentableTextBlock commentableId="comm-5">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentableIcon />
        </div>
        <blockquote>
          <p>Block quotes are written like so.</p>
          <p>They can span multiple paragraphs, if you like.</p>
        </blockquote>
      </CommentableTextBlock>
      <CommentableTextBlock commentableId="comm-6">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentableIcon />
        </div>
        <p>
          Note that --- not considering the asterisk --- the actual text content
          starts at 4-columns in.
        </p>
      </CommentableTextBlock>
    </div>
    <CommentableCommentsBlock />
  </CommentableProvider>
))
