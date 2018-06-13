import { storiesOf } from '@storybook/react'
import { px, viewHeight, viewWidth } from 'csx'
import React from 'react'
import { Bar as BarChart } from 'react-chartjs'
import { cssRule } from 'typestyle'
import { Resource } from '../src/components/core/Resource'
import { Reference } from '../src/components/ui/Reference'
import { SidebarsController } from '../src/components/ui/SidebarsController'
import { Sidebar } from '../src/components/ui/Sidebar'
import { CommentsInMemoryService } from '../test/helpers/CommentsInMemoryService'

cssRule('.nf-comments-block', {
  position: 'relative',
  $nest: {
    '&:hover, &--active': {
      backgroundColor: '#FDD835'
    }
  }
})

cssRule('.nf-comments-marker', {
  position: 'absolute',
  top: 0,
  left: px(-30),
  cursor: 'pointer'
})

cssRule('.nf-comments-sidebar', {
  backgroundColor: '#F0F0F0',
  borderLeft: `${px(2)} solid #808080`,
  zIndex: 10,
  padding: px(15),
  width: px(300),
  maxWidth: viewWidth(75),
  height: viewHeight(100),
  position: 'fixed',
  top: 0,
  right: 0,
  $nest: {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }
})

cssRule('.nf-comments-sidebar__close', {
  display: 'inline-block',
  height: px(24),
  $nest: {
    svg: {
      fill: '#666'
    }
  }
})

cssRule('.nf-comments-new-form', {
  display: 'grid',
  gridTemplate: `
  "title  title     title" min-content
  "text   text      text" min-content
  "null   secondary primary" min-content
  "error  error     error" min-content
  / 2fr 1fr 1fr
  `,
  gridGap: px(10),
  justifyContent: 'flex-end',
  paddingBottom: px(20),
  borderBottom: `${px(2)} solid #E0E0E0`,
  $nest: {
    h2: {
      gridArea: 'title'
    },
    textarea: {
      gridArea: 'text'
    },
    button: {
      $nest: {
        '&:first-of-type': {
          gridArea: 'secondary'
        },
        '&:last-of-type': {
          gridArea: 'primary'
        }
      }
    },
    span: {
      gridArea: 'error',
      color: '#CC0000'
    }
  }
})

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
    <SidebarsController>
      <Resource resource="first" service={commentService}>
        <Reference reference="comm-1">
          <h1>First provider</h1>
        </Reference>
        <Reference reference="comm-2">
          <p>Paragraphs are separated by a blank line.</p>
        </Reference>
        <Reference reference="comm-3">
          <p>
            2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists look like:
          </p>
        </Reference>
        <Reference reference="comm-4">
          <ul>
            <li>this one</li>
            <li>that one</li>
            <li>the other one</li>
          </ul>
        </Reference>

        <Sidebar />
      </Resource>

      <Resource resource="another-2" service={commentService}>
        <Reference reference="comm-1">
          <h1>Another provider</h1>
        </Reference>

        <Reference reference="comm-5">
          <blockquote>
            <p>Block quotes are written like so.</p>
            <p>They can span multiple paragraphs, if you like.</p>
          </blockquote>
        </Reference>
        <Reference reference="comm-6">
          <p>Note that --- not considering the asterisk --- the actual text content starts at 4-columns in.</p>
        </Reference>
        <Reference reference="comm-7">
          <div>
            <BarChart data={chartData} options={chartOptions} />
          </div>
        </Reference>

        <Sidebar />
      </Resource>
    </SidebarsController>
  </div>
))
