import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import { sidebarClassName, sidebarClassNameWrapper } from './components/styling'
import { CommentableSidebarComponent } from '../src/components/CommentableSidebar'

const commentable = {
  addComment: action('Add a comment'),
  removeComment: action('Remove a comment'),
  getReferenceComments: () => [
    { id: 1, content: 'This is a comment', author: 'Davide' },
    { id: 2, content: 'This is a comment', author: 'Paolo' },
    { id: 3, content: 'This is a comment', author: 'Filippo' }
  ]
}

storiesOf('Commentable/SideBar', module).add('Default', () => (
  <div className={sidebarClassNameWrapper}>
    <CommentableSidebarComponent commentable={commentable} className={sidebarClassName} />
  </div>
))
