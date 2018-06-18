import { mount } from 'enzyme'
import React from 'react'
import { CommentsList } from '../../../src/components/ui/CommentsList'
import { withResourceContext, getDefaultResourceContext } from '../../helpers/context'
import { getDefaultState } from '../../../src/state/helpers/getters'
import { createComment } from '../../../src/state/helpers/creators'
import { setCommentToResource } from '../../../src/state/reducers/resource'

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
      expect(wrapper.contains(<h2 className="CLS__title">FOO</h2>)).toBeTruthy()
    })

    test('should render comments with the standard component', () => {
      const context = getDefaultResourceContext({
        commentsState: setCommentToResource(
          getDefaultState('RESOURCE'),
          { id: 'REFERENCE' },
          createComment({
            reference: { id: 'REFERENCE' },
            id: 'comm-1',
            content: 'AAA',
            author: 'Davide'
          })
        )
      })

      const wrapper = mount(withResourceContext(<CommentsList reference="REFERENCE" />, context))
      expect(wrapper.find('section').hasClass('nf-commentami-list')).toBeTruthy()
      expect(wrapper.contains(<p className="nf-commentami-comment__content">AAA</p>)).toBeTruthy()
    })

    test('should render comments with the custom component', () => {
      let state = setCommentToResource(
        getDefaultState('RESOURCE'),
        { id: 'REFERENCE' },
        createComment({
          reference: { id: 'REFERENCE' },
          id: 'comm-1',
          content: 'AAA',
          author: 'Davide'
        })
      )
      state = setCommentToResource(
        state,
        { id: 'REFERENCE' },
        createComment({
          reference: { id: 'REFERENCE' },
          id: 'comm-2',
          content: 'BBB',
          author: 'Davide'
        })
      )

      const context = getDefaultResourceContext({
        commentsState: state
      })

      const wrapper = mount(
        withResourceContext(
          <CommentsList className="foo" reference="REFERENCE" commentComponent={CustomComment} />,
          context
        )
      )

      expect(wrapper.find('section').hasClass('foo')).toBeTruthy()
      expect(wrapper.contains(<p>AAA</p>)).toBeTruthy()
      expect(wrapper.contains(<p>BBB</p>)).toBeTruthy()
      expect(wrapper.contains(<p>CCC</p>)).toBeFalsy()
    })
  })
})
