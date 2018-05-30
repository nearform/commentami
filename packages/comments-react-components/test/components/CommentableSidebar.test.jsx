import React from 'react'
import { mount } from 'enzyme'
import sleep from 'sleep-promise'

import { CommentableSidebarComponent } from '../../src/components/CommentableSidebar'
import { sidebarClassName } from '../../stories/components/styling'

describe('CommentableSidebarComponent', () => {
  let commentable
  let wrapper
  let formComponent = beforeEach(() => {
    commentable = {
      toggledReference: 'block-1',
      toggleComments: jest.fn(),
      addComment: jest.fn(),
      removeComment: jest.fn(),
      getReferenceComments: () => [
        { id: 1, content: 'This is a comment', author: 'Davide' },
        { id: 2, content: 'This is a comment', author: 'Paolo' },
        { id: 3, content: 'This is a comment', author: 'Filippo' }
      ]
    }
    wrapper = mount(<CommentableSidebarComponent commentable={commentable} className={sidebarClassName} />)
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
      expect(commentable.addComment).toHaveBeenCalledWith('block-1', 'new value')
    })

    test('should not call the add comment if the text trimmed is empty ', () => {
      formComponent.find('textarea').instance().value = ' '
      formComponent.find('textarea').simulate('change')
      formComponent
        .find('button')
        .at(1)
        .simulate('click')
      expect(commentable.addComment).not.toHaveBeenCalled()
    })

    test('should call the add comment if the text is trimmed and not empty', () => {
      formComponent.find('textarea').instance().value = '  new value  '
      formComponent.find('textarea').simulate('change')
      formComponent
        .find('button')
        .at(1)
        .simulate('click')
      expect(commentable.addComment).toHaveBeenCalledWith('block-1', 'new value')
    })

    test('should not call the add comment if the text area has no value', () => {
      formComponent
        .find('button')
        .at(1)
        .simulate('click')
      expect(commentable.addComment).not.toHaveBeenCalled()
    })
  })

  describe('Click on "Hide"', () => {
    test('should call the toggleComments', () => {
      wrapper.find('a[data-role="close"]').simulate('click')
      expect(commentable.toggleComments).toHaveBeenCalled()
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
      expect(commentable.removeComment).toHaveBeenCalledWith(1)
    })
  })

  describe('Hit the "enter" key on textarea', () => {
    test('should call the add comment if shift is not pressed', async () => {
      formComponent.find('textarea').instance().value = 'new value'
      formComponent.find('textarea').simulate('change')
      formComponent.find('textarea').simulate('keypress', { key: 'Enter', shiftKey: false })
      await sleep(50)
      expect(commentable.addComment).toHaveBeenCalledWith('block-1', 'new value')
    })

    test('should not call the add comment if shift is pressed', async () => {
      formComponent.find('textarea').instance().value = 'new value'
      formComponent.find('textarea').simulate('change')
      formComponent.find('textarea').simulate('keypress', { key: 'Enter', shiftKey: true })
      await sleep(50)
      expect(commentable.addComment).not.toHaveBeenCalled()
    })
  })
})
