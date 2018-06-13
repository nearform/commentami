import { mount } from 'enzyme'
import React from 'react'
import { NewCommentForm } from '../../../src/components/ui/NewCommentForm'
import { getDefaultState } from '../../../src/state/helpers/getters'
import { getDefaultResourceContext, withResourceContext, delay } from '../../helpers/context'

describe('NewCommentForm', () => {
  describe('.render', () => {
    test('should render the core elements', () => {
      const wrapper = mount(withResourceContext(<NewCommentForm reference="REFERENCE" />, getDefaultResourceContext()))

      expect(wrapper.find('form').hasClass('nf-comments-new-form')).toBeTruthy()
      expect(wrapper.find('textarea.nf-comments-new-form__textarea').prop('placeholder')).toEqual('Enter some text ...')
      expect(wrapper.find('button.nf-comments-new-form__button--secondary').text()).toEqual('Cancel')
      expect(wrapper.find('button.nf-comments-new-form__button--primary').text()).toEqual('Add')
    })

    test('should allow class, title and labels overriding', () => {
      const wrapper = mount(
        withResourceContext(
          <NewCommentForm
            className="CLS"
            title="TITLE"
            placeholder="PLACEHOLDER"
            cancelLabel="CANCEL"
            submitLabel="SUBMIT"
            reference="REFERENCE"
          />,
          getDefaultResourceContext()
        )
      )

      expect(wrapper.find('form').hasClass('CLS')).toBeTruthy()
      expect(wrapper.find('h2.nf-comments-new-form__title').text()).toEqual('TITLE')
      expect(wrapper.find('textarea.nf-comments-new-form__textarea').prop('placeholder')).toEqual('PLACEHOLDER')
      expect(wrapper.find('button.nf-comments-new-form__button--secondary').text()).toEqual('CANCEL')
      expect(wrapper.find('button.nf-comments-new-form__button--primary').text()).toEqual('SUBMIT')
    })

    test('should show saving state', () => {
      const wrapper = mount(
        withResourceContext(
          <NewCommentForm savingLabel="SAVING" reference="REFERENCE" />,
          getDefaultResourceContext({ commentsState: { ...getDefaultState(), isUpdating: true } })
        )
      )

      expect(wrapper.find('button.nf-comments-new-form__button--primary').text()).toEqual('SAVING')
      expect(wrapper.find('button.nf-comments-new-form__button--primary[disabled]').length).toEqual(1)
    })

    test('should show error state', () => {
      const wrapper = mount(
        withResourceContext(
          <NewCommentForm savingLabel="SAVING" reference="REFERENCE" />,
          getDefaultResourceContext({ commentsState: { ...getDefaultState(), updateError: new Error('ERROR') } })
        )
      )

      expect(
        wrapper
          .find('span')
          .first()
          .text()
          .includes('ERROR')
      ).toBeTruthy()
    })
  })

  describe('submitting', () => {
    test('should submit when clicking on the button', async () => {
      const addComment = jest.fn().mockResolvedValue('COMMENT')

      const wrapper = mount(
        withResourceContext(
          <NewCommentForm reference="REFERENCE" addComment={addComment} />,
          getDefaultResourceContext({
            addComment
          })
        )
      )

      const textarea = wrapper.find('textarea').instance()
      textarea.value = 'VALUE'

      wrapper.find('button.nf-comments-new-form__button--primary').simulate('click')
      await delay()

      expect(addComment).toHaveBeenCalledWith('REFERENCE', 'VALUE')
      expect(textarea.value).toEqual('')
    })

    test('should NOT clear the textarea if any problem occurred', async () => {
      const addComment = jest.fn().mockRejectedValue(new Error('REJECTED'))

      const wrapper = mount(
        withResourceContext(
          <NewCommentForm reference="REFERENCE" addComment={addComment} />,
          getDefaultResourceContext()
        )
      )

      const textarea = wrapper.find('textarea').instance()

      textarea.value = 'VALUE'
      expect(textarea.value).toEqual('VALUE')

      wrapper.find('button.nf-comments-new-form__button--primary').simulate('click')
      await delay()

      expect(textarea.value).toEqual('VALUE')
    })

    test('should submit when typing enter', async () => {
      const addComment = jest.fn().mockResolvedValue('SENT')

      const wrapper = mount(
        withResourceContext(
          <NewCommentForm reference="REFERENCE" addComment={addComment} />,
          getDefaultResourceContext({ addComment })
        )
      )

      const textarea = wrapper.find('textarea').instance()

      textarea.value = 'VALUE'
      wrapper.find('textarea').simulate('keyPress', { key: 'enter' })
      await delay()

      expect(addComment).toHaveBeenCalledWith('REFERENCE', 'VALUE')
      expect(textarea.value).toEqual('')
    })

    test('should NOT submit when there is no value', () => {
      const addComment = jest.fn()

      const wrapper = mount(
        withResourceContext(
          <NewCommentForm reference="REFERENCE" addComment={addComment} />,
          getDefaultResourceContext()
        )
      )

      wrapper.find('button.nf-comments-new-form__button--primary').simulate('click')

      expect(addComment).not.toHaveBeenCalled()
    })

    test('should NOT submit when typing shift+enter', async () => {
      const addComment = jest.fn()

      const wrapper = mount(
        withResourceContext(
          <NewCommentForm reference="REFERENCE" addComment={addComment} />,
          getDefaultResourceContext()
        )
      )

      const textarea = wrapper.find('textarea').instance()

      textarea.value = 'VALUE'
      wrapper.find('textarea').simulate('keyPress', { key: 'enter', shiftKey: true })
      await delay()

      expect(addComment).not.toHaveBeenCalled()
    })
  })

  describe('resetting', () => {
    test('should clear input when clicking on the button', () => {
      const wrapper = mount(withResourceContext(<NewCommentForm reference="REFERENCE" />, getDefaultResourceContext()))

      const textarea = wrapper.find('textarea').instance()

      textarea.value = 'VALUE'

      expect(textarea.value).toEqual('VALUE')
      wrapper.find('button.nf-comments-new-form__button--secondary').simulate('click')
      expect(textarea.value).toEqual('')
    })
  })
})
