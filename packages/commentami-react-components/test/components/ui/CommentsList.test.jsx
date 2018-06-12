import { mount } from 'enzyme'
import React from 'react'
import { CommentsList } from '../../../src/components/ui/CommentsList'
import { withResourceContext, getDefaultResourceContext } from '../../helpers/context'

function CustomComment({ comment: { content } }) {
  return <p>{content}</p>
}

describe('CommentsList', () => {
  describe('.render', () => {
    test('should render no comments by default', () => {
      const defaultContext = getDefaultResourceContext()
      const wrapper = mount(
        withResourceContext(<CommentsList reference="REFERENCE" title="FOO" className="CLS" />, defaultContext)
      )

      expect(wrapper.find('section').hasClass('CLS')).toBeTruthy()
      expect(wrapper.contains(<h2 className="nf-comments-list__title">FOO</h2>)).toBeTruthy()
    })

    test('should render comments with the standard component', () => {
      const context = getDefaultResourceContext({
        listReferenceComments: jest
          .fn()
          .mockReturnValue([{ reference: { id: 'REFERENCE' }, id: 'comm-1', content: 'AAA' }])
      })

      const wrapper = mount(withResourceContext(<CommentsList reference="REFERENCE" />, context))
      expect(wrapper.find('section').hasClass('nf-comments-list')).toBeTruthy()
      expect(wrapper.contains(<p className="nf-comments-comment__content">AAA</p>)).toBeTruthy()
    })

    test('should render comments with the custom component', () => {
      const context = getDefaultResourceContext({
        listReferenceComments: jest
          .fn()
          .mockReturnValue([
            { reference: { id: 'REFERENCE' }, id: 'comm-1', content: 'AAA' },
            { reference: { id: 'REFERENCE' }, id: 'comm-2', content: 'BBB' }
          ])
      })

      const wrapper = mount(
        withResourceContext(<CommentsList reference="REFERENCE" commentComponent={CustomComment} />, context)
      )

      expect(wrapper.find('section').hasClass('nf-comments-list')).toBeTruthy()
      expect(wrapper.contains(<p>AAA</p>)).toBeTruthy()
      expect(wrapper.contains(<p>BBB</p>)).toBeTruthy()
      expect(wrapper.contains(<p>CCC</p>)).toBeFalsy()
    })
  })
})
