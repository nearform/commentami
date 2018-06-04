import React from 'react'
import { omit } from 'lodash'
import { mount } from 'enzyme'
import sleep from 'sleep-promise'

import { CommentableSidebarComponent } from '../../src/components/CommentableSidebar'
import { CommentsInMemoryService } from '../helpers/CommentsInMemoryService'
import { CommentsState } from '../../src/state/Comments'

import { sidebarClassName } from '../../stories/components/styling'

describe('CommentableSidebar', () => {
  let commentableState
  let wrapper
  let formComponent

  const setState = newState => {
    commentableState = Object.assign({}, commentableState, newState)
  }

  const getState = () => commentableState

  beforeEach(async () => {
    commentableState = {
      toggledReference: { id: 'ref-1' },
      toggleComments: jest.fn(),
      addComment: jest.fn(),
      removeComment: jest.fn(),
      lastResourceRefreshed: { id: 'res-1' }
    }

    const commentObject = new CommentsState(new CommentsInMemoryService(), getState, setState)
    await commentObject.addComment({ reference: { id: 'ref-1' }, content: 'This is a comment' })
    await commentObject.addComment({ reference: { id: 'ref-1' }, content: 'This is a comment 2' })
    await commentObject.addComment({ reference: { id: 'ref-1' }, content: 'This is a comment 3' })

    wrapper = mount(<CommentableSidebarComponent commentable={commentableState} className={sidebarClassName} />)
    formComponent = wrapper.find('div[data-role="form"]')
  })

  test('The sidebar should contain the comments', () => {
    expect(wrapper.find('DefaultCommentComponent').length).toBe(3)
  })

  test('The form  should contain a textarea and 2 buttons', () => {
    const formComponent = wrapper.find('div[data-role="form"]')
    expect(formComponent.find('textarea').length).toBe(1)
    expect(formComponent.find('button').length).toBe(2)
  })

  describe('Click on "add a comment"', () => {
    test('should call the add comment if the text area has value', () => {
      formComponent.find('textarea').instance().value = 'new value'
      formComponent.find('textarea').simulate('change')
      formComponent
        .find('button')
        .at(1)
        .simulate('click')
      expect(commentableState.addComment).toHaveBeenCalledWith({ id: 'ref-1' }, 'new value')
    })

    test('should not call the add comment if the text trimmed is empty ', () => {
      formComponent.find('textarea').instance().value = ' '
      formComponent.find('textarea').simulate('change')
      formComponent
        .find('button')
        .at(1)
        .simulate('click')
      expect(commentableState.addComment).not.toHaveBeenCalled()
    })

    test('should call the add comment if the text is trimmed and not empty', () => {
      formComponent.find('textarea').instance().value = '  new value  '
      formComponent.find('textarea').simulate('change')
      formComponent
        .find('button')
        .at(1)
        .simulate('click')
      expect(commentableState.addComment).toHaveBeenCalledWith({ id: 'ref-1' }, 'new value')
    })

    test('should not call the add comment if the text area has no value', () => {
      formComponent
        .find('button')
        .at(1)
        .simulate('click')
      expect(commentableState.addComment).not.toHaveBeenCalled()
    })
  })

  describe('Click on "Hide"', () => {
    test('should call the toggleComments', () => {
      wrapper.find('a[data-role="close"]').simulate('click')
      expect(commentableState.toggleComments).toHaveBeenCalled()
    })
  })

  describe('Click on "cancel"', () => {
    test('should reset the textarea value', () => {
      formComponent.find('textarea').instance().value = 'new value'
      formComponent.find('textarea').simulate('change')
      formComponent
        .find('button')
        .at(0)
        .simulate('click')
      expect(formComponent.find('textarea').instance().value).toBe('')
    })
  })

  describe('Click on "Remove"', () => {
    test('should call the removeComment', () => {
      wrapper
        .find('DefaultCommentComponent')
        .at(0)
        .find('button')
        .simulate('click')

      expect(omit(commentableState.removeComment.mock.calls[0][0], ['createdAt'])).toEqual({
        id: 1,
        content: 'This is a comment',
        reference: { id: 'ref-1' },
        author: 'someauthor'
      })
    })
  })

  describe('Hit the "enter" key on textarea', () => {
    test('should call the add comment if shift is not pressed', async () => {
      formComponent.find('textarea').instance().value = 'new value'
      formComponent.find('textarea').simulate('change')
      formComponent.find('textarea').simulate('keypress', { key: 'Enter', shiftKey: false })
      await sleep(50)
      expect(commentableState.addComment).toHaveBeenCalledWith({ id: 'ref-1' }, 'new value')
    })

    test('should not call the add comment if shift is pressed', async () => {
      formComponent.find('textarea').instance().value = 'new value'
      formComponent.find('textarea').simulate('change')
      formComponent.find('textarea').simulate('keypress', { key: 'Enter', shiftKey: true })
      await sleep(50)
      expect(commentableState.addComment).not.toHaveBeenCalled()
    })
  })
})
