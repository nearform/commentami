import React from 'react'
import { Bar as BarChart } from 'react-chartjs'
import { style } from 'typestyle'
import { storiesOf } from '@storybook/react'

import { CommentableProvider } from '../src/components/CommentableProvider'
import { CommentableBlock } from '../src/components/CommentableBlock'

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

const sidebarClassName = style({
  backgroundColor: '#E0E0E0',
  borderLeft: '2px solid #808080',
  zIndex: 10,
  padding: '15px',
  height: '100vh',
  $nest: {
    '[data-role=form]': {
      display: 'grid',
      gridTemplateRows: 'auto 75px auto',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: '5px',
      justifyContent: 'flex-end'
    },
    '[data-role=form] h2, [data-role=form] textarea': {
      gridColumn: '1 / span 3'
    },
    '[data-role=form] button:first-of-type': {
      gridColumn: '2 / 3',
      height: '30px'
    },
    '[data-role=comments] > div': {
      margin: 0,
      padding: '0 0 0 20px'
    },
    '[data-role=close]': {
      position: 'absolute',
      top: '15px',
      right: '15px'
    }
  }
})

const highlightedBlockClassName = style({
  backgroundColor: '#e3ead4'
})

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
    <CommentableProvider sidebarClassName={sidebarClassName} commentComponent1={CustomCommentRenderer}>
      <CommentableBlock blockId="comm-1" highlightedClassName={highlightedBlockClassName}>
        <h1>TextBlock 1</h1>
      </CommentableBlock>
      <CommentableBlock blockId="comm-2" highlightedClassName={highlightedBlockClassName}>
        <p>Paragraphs are separated by a blank line.</p>
      </CommentableBlock>
      <CommentableBlock blockId="comm-3" highlightedClassName={highlightedBlockClassName}>
        <p>
          2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists look like:
        </p>
      </CommentableBlock>
      <CommentableBlock blockId="comm-4" highlightedClassName={highlightedBlockClassName}>
        <ul>
          <li>this one</li>
          <li>that one</li>
          <li>the other one</li>
        </ul>
      </CommentableBlock>
      <CommentableBlock blockId="comm-5" highlightedClassName={highlightedBlockClassName}>
        <blockquote>
          <p>Block quotes are written like so.</p>
          <p>They can span multiple paragraphs, if you like.</p>
        </blockquote>
      </CommentableBlock>
      <CommentableBlock blockId="comm-6" highlightedClassName={highlightedBlockClassName}>
        <p>Note that --- not considering the asterisk --- the actual text content starts at 4-columns in.</p>
      </CommentableBlock>
      <CommentableBlock blockId="comm-7" highlightedClassName={highlightedBlockClassName}>
        <div>
          <BarChart data={chartData} options={chartOptions} />
        </div>
      </CommentableBlock>
    </CommentableProvider>
  </div>
))
