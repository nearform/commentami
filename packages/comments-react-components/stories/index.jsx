import { storiesOf } from '@storybook/react'
import React from 'react'
import { Bar as BarChart } from 'react-chartjs'
import { CommentableBlock } from '../src/components/core/CommentableBlock'
import { CommentableProvider } from '../src/components/core/CommentableProvider'
import { CommentableSidebar } from '../src/components/ui/CommentableSidebar'
import { CommentableSidebarsContainer } from '../src/components/ui/CommentableSidebarsContainer'
import { CommentsInMemoryService } from '../test/helpers/CommentsInMemoryService'
import { Block } from './components/block'
import { Sidebar } from './components/sidebar'

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

storiesOf('Commentable/Text', module).add('Sample Text', () => (
  <div style={{ margin: '30px' }}>
    <CommentableSidebarsContainer>
      <CommentableProvider resource="first" service={commentService}>
        <CommentableBlock reference="comm-1" render={props => <Block {...props} />}>
          <h1>First provider</h1>
        </CommentableBlock>
        <CommentableBlock reference="comm-2" component={Block}>
          <p>Paragraphs are separated by a blank line.</p>
        </CommentableBlock>
        <CommentableBlock reference="comm-3" component={Block}>
          <p>
            2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists look like:
          </p>
        </CommentableBlock>
        <CommentableBlock reference="comm-4" component={Block}>
          <ul>
            <li>this one</li>
            <li>that one</li>
            <li>the other one</li>
          </ul>
        </CommentableBlock>

        <CommentableSidebar component={Sidebar} />
      </CommentableProvider>

      <CommentableProvider resource="another-2" service={commentService}>
        <CommentableBlock reference="comm-1" render={props => <Block {...props} />}>
          <h1>Another provider</h1>
        </CommentableBlock>

        <CommentableBlock reference="comm-5" component={Block}>
          <blockquote>
            <p>Block quotes are written like so.</p>
            <p>They can span multiple paragraphs, if you like.</p>
          </blockquote>
        </CommentableBlock>
        <CommentableBlock reference="comm-6" component={Block}>
          <p>Note that --- not considering the asterisk --- the actual text content starts at 4-columns in.</p>
        </CommentableBlock>
        <CommentableBlock reference="comm-7" component={Block}>
          <div>
            <BarChart data={chartData} options={chartOptions} />
          </div>
        </CommentableBlock>

        <CommentableSidebar component={Sidebar} />
      </CommentableProvider>
    </CommentableSidebarsContainer>
  </div>
))
