import React from 'react'
import { Bar as BarChart } from 'react-chartjs'
import { storiesOf } from '@storybook/react'

import { CommentsInMemoryService } from './helpers/CommentsInMemoryService'
import { CommentableProvider } from '../src/components/CommentableProvider'
import { CommentableBlock } from '../src/components/CommentableBlock'

import { sidebarClassName, highlightedReferenceClassName } from './components/styling'
import { EventsManager } from './components/EventsManager'

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

const commentService = CommentsInMemoryService()

function CustomCommentRenderer({ comment }) {
  return (
    <div>
      <h4>{comment.author} had fun saying:</h4>
      <p>{comment.content}</p>
    </div>
  )
}

storiesOf('Commentable/Text', module).add('Sample Text', () => (
  <div style={{ margin: '30px' }}>
    <CommentableProvider
      resource="sample-text-section"
      service={commentService}
      sidebarClassName={sidebarClassName}
      commentComponent={CustomCommentRenderer}
      eventsManagerComponent={EventsManager}
    >
      <CommentableBlock referenceId="comm-1" highlightedClassName={highlightedReferenceClassName}>
        <h1>Text Title 1</h1>
      </CommentableBlock>
      <CommentableBlock referenceId="comm-2" highlightedClassName={highlightedReferenceClassName}>
        <p>Paragraphs are separated by a blank line.</p>
      </CommentableBlock>
      <CommentableBlock referenceId="comm-3" highlightedClassName={highlightedReferenceClassName}>
        <p>
          2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists look like:
        </p>
      </CommentableBlock>
      <CommentableBlock referenceId="comm-4" highlightedClassName={highlightedReferenceClassName}>
        <ul>
          <li>this one</li>
          <li>that one</li>
          <li>the other one</li>
        </ul>
      </CommentableBlock>
      <CommentableBlock referenceId="comm-5" highlightedClassName={highlightedReferenceClassName}>
        <blockquote>
          <p>Block quotes are written like so.</p>
          <p>They can span multiple paragraphs, if you like.</p>
        </blockquote>
      </CommentableBlock>
      <CommentableBlock referenceId="comm-6" highlightedClassName={highlightedReferenceClassName}>
        <p>Note that --- not considering the asterisk --- the actual text content starts at 4-columns in.</p>
      </CommentableBlock>
      <CommentableBlock referenceId="comm-7" highlightedClassName={highlightedReferenceClassName}>
        <div>
          <BarChart data={chartData} options={chartOptions} />
        </div>
      </CommentableBlock>
    </CommentableProvider>
  </div>
))
