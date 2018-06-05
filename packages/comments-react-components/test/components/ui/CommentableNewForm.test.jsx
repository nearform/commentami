import { mount } from 'enzyme'
import React from 'react'
import { getComponentWithContext } from '../../helpers/context'

function createComponent(context) {
  return getComponentWithContext(
    'CommentableNewForm',
    context,
    'CommentableContext',
    require.resolve('../../../src/components/ui/CommentableNewForm'),
    require.resolve('../../../src/components/core/CommentableProvider')
  )
}

describe('CommentableNewForm', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  describe('.render', () => {
    test('should render the core elements', () => {
      const CommentableNewForm = createComponent({})

      const wrapper = mount(<CommentableNewForm />)

      expect(wrapper.find('form').hasClass('nf-comments-new-form')).toBeTruthy()
      expect(wrapper.find('textarea.nf-comments-new-form__textarea').prop('placeholder')).toEqual('Enter some text ...')
      expect(wrapper.find('button.nf-comments-new-form__button--secondary').text()).toEqual('Cancel')
      expect(wrapper.find('button.nf-comments-new-form__button--primary').text()).toEqual('Add')
    })

    test('should allow class, title and labels overriding', () => {
      const CommentableNewForm = createComponent({})

      const wrapper = mount(<CommentableNewForm className="CLS" title="TITLE" placeholder="PLACEHOLDER" cancelLabel="CANCEL" submitLabel="SUBMIT" />)

      expect(wrapper.find('form').hasClass('CLS')).toBeTruthy()
      expect(wrapper.find('h2.nf-comments-new-form__title').text()).toEqual('TITLE')
      expect(wrapper.find('textarea.nf-comments-new-form__textarea').prop('placeholder')).toEqual('PLACEHOLDER')
      expect(wrapper.find('button.nf-comments-new-form__button--secondary').text()).toEqual('CANCEL')
      expect(wrapper.find('button.nf-comments-new-form__button--primary').text()).toEqual('SUBMIT')
    })
  })

  describe('submitting', () => {
    test('should submit when clicking on the button', () => {
      const CommentableNewForm = createComponent({})

      const wrapper = mount(<CommentableNewForm reference="REFERENCE" />)
      const addCommentSpy = jest.spyOn(wrapper.instance(), 'addComment').mockImplementation()

      wrapper.instance().textareaRef.current.value = 'VALUE'
      wrapper.find('button.nf-comments-new-form__button--primary').simulate('click')

      expect(addCommentSpy).toHaveBeenCalledWith('REFERENCE', 'VALUE')
    })

    test('should submit when typing enter', async () => {
      const CommentableNewForm = createComponent({})

      const wrapper = mount(<CommentableNewForm reference="REFERENCE" />)
      const addCommentSpy = jest.spyOn(wrapper.instance(), 'addComment').mockImplementation()

      wrapper.instance().textareaRef.current.value = 'VALUE'
      wrapper.find('textarea').simulate('keyPress', { key: 'enter' })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(addCommentSpy).toHaveBeenCalledWith('REFERENCE', 'VALUE')
    })

    test('should NOT submit when there is no value', () => {
      const CommentableNewForm = createComponent({})

      const wrapper = mount(<CommentableNewForm reference="REFERENCE" />)
      wrapper.instance().textareaRef.current.value = null
      const addCommentSpy = jest.spyOn(wrapper.instance(), 'addComment').mockImplementation()

      wrapper.find('button.nf-comments-new-form__button--primary').simulate('click')

      expect(addCommentSpy).not.toHaveBeenCalled()
    })

    test('should submit when typing shift+enter', async () => {
      const CommentableNewForm = createComponent({})

      const wrapper = mount(<CommentableNewForm reference="REFERENCE" />)
      const addCommentSpy = jest.spyOn(wrapper.instance(), 'addComment').mockImplementation()

      wrapper.instance().textareaRef.current.value = 'VALUE'
      wrapper.find('textarea').simulate('keyPress', { key: 'enter', shiftKey: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(addCommentSpy).not.toHaveBeenCalled()
    })
  })

  describe('resetting', () => {
    test('should clear input when clicking on the button', () => {
      const CommentableNewForm = createComponent({})

      const wrapper = mount(<CommentableNewForm reference="REFERENCE" />)
      const element = wrapper.instance().textareaRef.current

      element.value = 'VALUE'

      expect(element.value).toEqual('VALUE')
      wrapper.find('button.nf-comments-new-form__button--secondary').simulate('click')
      expect(element.value).toEqual('')
    })
  })
})
