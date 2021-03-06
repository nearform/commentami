import { withResource } from '@nearform/commentami-react-components'
import { CommentsList, NewCommentForm, withSidebars } from '@nearform/commentami-react-components/dist/ui'
import { rem, viewHeight, viewWidth } from 'csx'
import React from 'react'
import { createPortal } from 'react-dom'
import { style } from 'typestyle'
import { debugClassName } from '../styling/environment'
import { Comment } from './comment'
import { Icon } from './icon'

const sidebarClassName = style(debugClassName('sidebar'), {
  backgroundColor: '#F0F0F0',
  borderLeft: `${rem(0.2)} solid #808080`,
  overflow: 'auto',
  zIndex: 10,
  padding: rem(1.5),
  width: rem(40),
  maxWidth: viewWidth(75),
  height: viewHeight(100),
  position: 'fixed',
  top: 0,
  right: 0
})

const sidebarHeaderClassName = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export const Sidebar = withSidebars(
  withResource(
    class extends React.Component {
      constructor(props) {
        super(props)

        this.boundHandleClose = this.handleClose.bind(this)
      }

      handleClose(ev) {
        ev.preventDefault()

        this.props.controller.updateActive()
      }

      render() {
        const {
          controller,
          commentami: { resource }
        } = this.props

        if (!controller.isActive(resource)) return false

        const reference = this.props.controller.reference

        return createPortal(
          <aside className={sidebarClassName}>
            <header className={sidebarHeaderClassName}>
              <h1>Comments</h1>
              <a href="#" onClick={this.boundHandleClose}>
                <Icon name="close" />
              </a>
            </header>
            <NewCommentForm reference={reference} />
            <CommentsList reference={reference} commentComponent={Comment} />
          </aside>,
          document.body
        )
      }
    }
  )
)
