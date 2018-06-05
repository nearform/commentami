import { CommentableCommentsList, CommentableNewForm } from '@nearform/comments-react-components/dist/ui'
import { em, rem, viewHeight, viewWidth } from 'csx'
import React from 'react'
import { cssRule, style } from 'typestyle'
import { Comment } from './comment'
import { Icon } from './icon'

cssRule('.nf-comments-sidebar', {
  backgroundColor: '#F0F0F0',
  borderLeft: `${rem(0.2)} solid #808080`,
  zIndex: 10,
  padding: rem(1.5),
  width: rem(40),
  maxWidth: viewWidth(75),
  height: viewHeight(100),
  position: 'fixed',
  top: 0,
  right: 0
})

cssRule('.nf-comments-new-form', {
  display: 'grid',
  gridTemplate: `
  "title  title     title" min-content
  "text   text      text" min-content
  "null   secondary primary" min-content
  / 2fr 1fr 1fr
  `,
  gridGap: rem(1),
  justifyContent: 'flex-end'
})

cssRule('.nf-comments-new-form__title', { gridArea: 'title' })

cssRule('.nf-comments-new-form__textarea', {
  gridArea: 'text',
  border: `${rem(0.1)} solid #E0E0E0`,
  height: rem(10),
  padding: rem(0.5)
})

cssRule('.nf-comments-new-form__button', {
  border: `${rem(0.1)} solid #E0E0E0`,
  padding: `${rem(1)} ${rem(2)}`,
  whiteSpace: 'nowrap',
  fontWeight: 'bold',
  fontSize: em(0.8),
  cursor: 'pointer'
})

cssRule('.nf-comments-new-form__button--secondary', {
  gridArea: 'secondary',
  backgroundColor: '#F0F0F0',
  $nest: {
    '&:hover': { backgroundColor: '#E8E8E8' }
  }
})

cssRule('.nf-comments-new-form__button--primary', {
  gridArea: 'primary',
  backgroundColor: '#DA3338',
  color: 'white',
  $nest: {
    '&:hover': { backgroundColor: '#CC0000' }
  }
})

const sidebarHeaderClassName = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export class Sidebar extends React.Component {
  constructor(props) {
    super(props)

    this.boundHandleClose = this.handleClose.bind(this)
  }

  handleClose(ev) {
    ev.preventDefault()

    this.props.sidebars.updateActive()
  }

  render() {
    const reference = this.props.sidebars.reference

    return (
      <React.Fragment>
        <header className={sidebarHeaderClassName}>
          <h1>{this.props.title || 'Comments'}</h1>
          <a href="#" onClick={this.boundHandleClose}>
            <Icon name="close" />
          </a>
        </header>
        <CommentableNewForm reference={reference} />
        <CommentableCommentsList reference={reference} commentComponent={Comment} />
      </React.Fragment>
    )
  }
}
