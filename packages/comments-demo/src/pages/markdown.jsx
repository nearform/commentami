import { CommentableBlock, CommentableProvider, CommentsFetchService } from '@nearform/comments-react-components'
import { rem } from 'csx'
import React from 'react'
import remark from 'remark'
import reactRenderer from 'remark-react'
import { style } from 'typestyle'
import data from '../fixtures/markdown.md'
import { debugClassName } from '../styling/environment'
import { sidebarClassName } from '../styling/sidebar'
import { pageClassName } from './index'
import { blockClassName, highlightedBlockClassName } from './plain'

const documentWrapperClassName = style(debugClassName('document-wrapper'), {
  marginTop: rem(5),
  padding: rem(3),
  backgroundColor: '#FCFCFC',
  border: `${rem(0.1)} dashed #C0C0C0`
})

const markerClassName = style(debugClassName('block'), {
  position: 'absolute',
  top: 0,
  left: rem(-3),
  cursor: 'pointer',
  $nest: {
    svg: {
      width: rem(3),
      height: rem(3),
      fill: 'yellow'
    }
  }
})

export function createCommentableElement(Tag) {
  let id = 0

  return function CommentableElement({ children }) {
    return (
      <CommentableBlock
        referenceId={`${Tag}-${id++}`}
        className={blockClassName}
        highlightedClassName={highlightedBlockClassName}
        markerClassName={markerClassName}
      >
        <Tag>{children}</Tag>
      </CommentableBlock>
    )
  }
}

export function MarkdownPage() {
  const parsed = remark()
    .use(reactRenderer, {
      remarkReactComponents: {
        h1: createCommentableElement('h1'),
        h2: createCommentableElement('h2'),
        h3: createCommentableElement('h3'),
        h4: createCommentableElement('h4'),
        h5: createCommentableElement('h5'),
        h6: createCommentableElement('h6'),
        p: createCommentableElement('p'),
        li: createCommentableElement('li')
      }
    })
    .processSync(data).contents

  return (
    <div className={pageClassName}>
      <h1>Welcome!</h1>

      <h2>The content in the box below is dynamically generated out of a Markdown file. Each non inline section is commentable.</h2>

      <CommentableProvider resource="foo" service={CommentsFetchService('http://localhost:8080/')} sidebarClassName={sidebarClassName}>
        <div className={documentWrapperClassName}>{parsed}</div>
      </CommentableProvider>
    </div>
  )
}
