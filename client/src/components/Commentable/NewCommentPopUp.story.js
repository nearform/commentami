import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { NewCommentPopUpElement } from './NewCommentPopUp'

storiesOf('Commentable/NewCommentPopUp', module)
  .add('Visible', () => (
    <NewCommentPopUpElement
      commentable={{
        showNewCommentPopUp: true,
        newCommentPopUpX: 20,
        newCommentPopUpY: 20,
        addNewComment: action('Add comment'),
        addNewCommentCancel: action('Cancel')
      }}
    />
  ))
  .add('Not Visible', () => (
    <NewCommentPopUpElement
      commentable={{
        showNewCommentPopUp: false,
        newCommentPopUpX: 20,
        newCommentPopUpY: 20,
        addNewComment: action('Add comment'),
        addNewCommentCancel: action('Cancel')
      }}
    />
  ))
