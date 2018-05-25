import React from 'react'
import { Bar as BarChart } from 'react-chartjs'
import { storiesOf } from '@storybook/react'

import { CommentableProvider } from '../src/components/Commentable/Provider'
import { CommentableTextBlock } from '../src/components/Commentable/TextBlock'

import { CommentsBlock } from '../src/components/Commentable/CommentsBlock'
import { CommentIcon } from '../src/components/Commentable/CommentIcon'
import { NewCommentPopUp } from '../src/components/Commentable/NewCommentPopUp'

const chartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fillColor: 'rgba(220,220,220,0.5)',
      strokeColor: 'rgba(220,220,220,0.8)',
      highlightFill: 'rgba(220,220,220,0.75)',
      highlightStroke: 'rgba(220,220,220,1)',
      data: [65, 59, 80, 81, 56, 55, 40]
    },
    {
      label: 'My Second dataset',
      fillColor: 'rgba(151,187,205,0.5)',
      strokeColor: 'rgba(151,187,205,0.8)',
      highlightFill: 'rgba(151,187,205,0.75)',
      highlightStroke: 'rgba(151,187,205,1)',
      data: [28, 48, 40, 19, 86, 27, 90]
    }
  ]
}

const chartOptions = {
  scaleBeginAtZero: true,
  scaleShowGridLines: true,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  barShowStroke: true,
  barStrokeWidth: 2,
  barValueSpacing: 5,
  barDatasetSpacing: 1
}

storiesOf('Commentable', module).add('Sample Text', () => (
  <CommentableProvider>
    <NewCommentPopUp />
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
      <CommentableTextBlock blockId="comm-7">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentIcon />
        </div>
        <div>
          <BarChart data={chartData} options={chartOptions} />
        </div>
      </CommentableTextBlock>
    </div>
    <CommentsBlock />
  </CommentableProvider>
))
