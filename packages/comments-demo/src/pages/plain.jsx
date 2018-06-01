/* globals localStorage */

import { CommentableBlock, CommentableProvider } from '@nearform/comments-react-components'
import { rem } from 'csx'
import React from 'react'
import { style } from 'typestyle'
import { debugClassName } from '../styling/environment'
import { sidebarClassName } from '../styling/sidebar'
import { pageClassName } from './index'

function buildInMemoryService() {
  return {
    addComment(comment) {
      const key = `comments:${comment.resource}`
      const raw = localStorage.getItem(key) || '[]'
      const existing = JSON.parse(raw)

      existing.push({ id: new Date().getTime(), resource: comment.resource, reference: comment.reference, content: comment.content, author: 'someauthor' })
      localStorage.setItem(key, JSON.stringify(existing))
    },

    removeComment(comment) {
      const id = comment.id
      const key = `comments:${comment.resource}`
      const raw = localStorage.getItem(key) || '[]'
      let existing = JSON.parse(raw)

      existing = existing.filter(c => c.id !== id)

      localStorage.setItem(key, JSON.stringify(existing))
    },

    getComments(resource) {
      const raw = localStorage.getItem(`comments:${resource}`) || '[]'

      return JSON.parse(raw)
    }
  }
}

export const blockClassName = style(debugClassName('block'), {
  $nest: {
    '&:hover': {
      backgroundColor: '#FFF9C4',
      color: 'black'
    }
  }
})

export const highlightedBlockClassName = style(debugClassName('block'), {
  backgroundColor: '#FDD835',
  color: 'black'
})

export const markerClassName = style(debugClassName('block'), {
  position: 'absolute',
  top: 0,
  left: rem(-7.3), // 48px is the size of the icon, 2.5rem=25px is to put "outside" the page
  cursor: 'pointer',
  $nest: {
    svg: {
      width: rem(4.8),
      height: rem(4.8),
      fill: 'yellow'
    }
  }
})

export function PlainPage() {
  return (
    <div className={pageClassName}>
      <CommentableProvider resource="foo" service={buildInMemoryService()} sidebarClassName={sidebarClassName}>
        <CommentableBlock referenceId="header" className={blockClassName} highlightedClassName={highlightedBlockClassName} markerClassName={markerClassName}>
          <h1>Welcome!</h1>
        </CommentableBlock>

        <CommentableBlock referenceId="title" className={blockClassName} highlightedClassName={highlightedBlockClassName} markerClassName={markerClassName}>
          <h2>Each text in this page is commentable. Just double click on it.</h2>
        </CommentableBlock>

        <CommentableBlock referenceId="p1" className={blockClassName} highlightedClassName={highlightedBlockClassName} markerClassName={markerClassName}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi egestas pulvinar lectus, at porttitor
            elit sodales a. Sed nec augue luctus, elementum eros quis, euismod ante. Maecenas vitae tempus mauris. Curabitur vel laoreet diam. Morbi varius nisi
            vitae aliquam porta. Suspendisse potenti. Proin tincidunt massa dui, sed placerat neque gravida non. Aenean fringilla magna eget sollicitudin
            volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc malesuada cursus nisi eu vehicula. Proin vel libero euismod, lacinia
            odio eget, iaculis erat.
          </p>
        </CommentableBlock>
        <CommentableBlock referenceId="p2" className={blockClassName} highlightedClassName={highlightedBlockClassName} markerClassName={markerClassName}>
          <p>
            Proin et dolor metus. Ut leo est, pretium sed interdum ut, imperdiet nec est. Aenean porta elit non elit finibus finibus. Proin malesuada, lorem sit
            amet placerat congue, lectus ligula porta sem, at pellentesque ante urna eget turpis. Quisque volutpat neque eget rutrum volutpat. Cras dignissim,
            justo vitae porta viverra, quam nibh porta dolor, vel pharetra lacus ipsum non purus. Duis lacinia urna auctor, sodales mauris in, blandit orci.
            Aenean sagittis orci eu tempus feugiat. Pellentesque varius dolor iaculis, tincidunt lectus at, volutpat sapien. Sed nec feugiat dolor. Nulla
            accumsan pretium nulla, sit amet tempus nunc aliquet non. Nunc imperdiet imperdiet rhoncus.
          </p>
        </CommentableBlock>
        <CommentableBlock referenceId="p3" className={blockClassName} highlightedClassName={highlightedBlockClassName} markerClassName={markerClassName}>
          <p>
            Vestibulum at ipsum tempus, laoreet erat ac, congue lectus. Nulla non cursus augue. Cras mollis vel ipsum eu posuere. Vestibulum ante ipsum primis
            in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris vestibulum, elit quis auctor mollis, dui est tincidunt augue, in aliquet eros erat
            vitae libero. Nam sed finibus turpis. Praesent maximus libero sed nibh ornare ornare. Vestibulum commodo sem id metus placerat hendrerit.
          </p>
        </CommentableBlock>
        <CommentableBlock referenceId="p4" className={blockClassName} highlightedClassName={highlightedBlockClassName} markerClassName={markerClassName}>
          <p>
            Pellentesque luctus diam a justo fringilla porta. Praesent facilisis ante at risus vehicula molestie. Morbi laoreet orci et ligula euismod, at
            posuere risus laoreet. Nunc blandit eros in arcu laoreet commodo. Duis vitae lacus a risus ornare finibus at at tortor. Suspendisse libero mi,
            dictum in ipsum sed, condimentum mollis justo. Quisque blandit metus eu volutpat tincidunt. Proin quis leo dui. In dolor diam, pharetra sit amet
            purus ut, iaculis interdum elit. Cras et orci tempor, elementum massa ac, molestie augue. Vivamus iaculis dui et lorem porta vehicula.
          </p>
        </CommentableBlock>
        <CommentableBlock referenceId="p5" className={blockClassName} highlightedClassName={highlightedBlockClassName} markerClassName={markerClassName}>
          <p>
            Aliquam id dolor placerat, consectetur est in, convallis purus. Nam arcu nulla, porta non risus ut, ultricies condimentum lorem. Ut nec purus eu est
            elementum tincidunt. Ut id nulla nec nibh ornare pretium. Vestibulum porttitor vehicula iaculis. Etiam at dignissim orci, sed imperdiet nulla. Nam
            lorem mi, finibus a libero vel, fringilla dictum odio. Phasellus erat velit, eleifend eget imperdiet elementum, malesuada eu dolor. Nunc ac risus
            venenatis, aliquam lectus id, lobortis tortor. Pellentesque purus metus, varius vel accumsan ac, malesuada rutrum nulla. Quisque a sapien sed nulla
            vestibulum ornare.
          </p>
        </CommentableBlock>
      </CommentableProvider>
    </div>
  )
}
