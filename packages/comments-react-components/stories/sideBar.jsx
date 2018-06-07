import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import { CommentableContext } from '../src/components/core/CommentableProvider'
import { CommentableControllerContext } from '../src/components/ui/CommentableController'
import { CommentableSidebar } from '../src/components/ui/CommentableSidebar'

const controller = {
  isActive: () => true,
  reference: 'foo'
}

const commentable = {
  addComment: action('Add a comment'),
  removeComment: action('Remove a comment'),
  toggledReference: { id: 'ref-1' },
  getReferenceComments: () => [
    { id: 1, content: 'This is a comment', author: 'Davide', reference: { id: 'ref-1' } },
    { id: 2, content: 'This is a comment', author: 'Paolo', reference: { id: 'ref-1' } },
    { id: 3, content: 'This is a comment', author: 'Filippo', reference: { id: 'ref-1' } }
  ]
}

storiesOf('Commentable/SideBar', module).add('Default', () => (
  <div>
    <CommentableControllerContext.Provider value={controller}>
      <CommentableContext.Provider value={commentable}>
        <CommentableSidebar />
      </CommentableContext.Provider>
    </CommentableControllerContext.Provider>
  </div>
))
