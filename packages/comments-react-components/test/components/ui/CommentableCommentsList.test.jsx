import { mount } from 'enzyme'
import React from 'react'
import { getComponentWithContext } from '../../helpers/context'

function createComponent(context) {
  return getComponentWithContext(
    'CommentableCommentsList',
    context,
    'CommentableContext',
    require.resolve('../../../src/components/ui/CommentableCommentsList'),
    require.resolve('../../../src/components/core/CommentableProvider')
  )
}

function CustomComment({ comment: { content } }) {
  return <p>{content}</p>
}

describe('CommentableCommentsList', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  describe('.render', () => {
    test('should render no comments by default', () => {
      const CommentableCommentsList = createComponent({})

      const wrapper = mount(<CommentableCommentsList title="FOO" className="CLS" />)

      expect(wrapper.find('section').hasClass('CLS')).toBeTruthy()
      expect(wrapper.contains(<h2 className="nf-comments-list__title">FOO</h2>)).toBeTruthy()
    })

    test('should render comments with the standard component', () => {
      const CommentableCommentsList = createComponent({
        commentsState: {
          comments: [{ reference: 'REFERENCE', id: 1, author: 'author', content: 'content' }]
        }
      })

      const wrapper = mount(<CommentableCommentsList reference="REFERENCE" />)
      expect(wrapper.find('section').hasClass('nf-comments-list')).toBeTruthy()
      expect(wrapper.contains(<p className="nf-comment__content">content</p>)).toBeTruthy()
    })

    test('should render comments with the custom component', () => {
      const CommentableCommentsList = createComponent({
        commentsState: {
          comments: [
            { reference: 'REFERENCE', id: 1, content: 'AAA' },
            { reference: 'REFERENCE', id: 2, content: 'BBB' },
            { reference: 'ANOTHER-REFERENCE', content: 'CCC' }
          ]
        }
      })

      const wrapper = mount(<CommentableCommentsList reference="REFERENCE" commentComponent={CustomComment} />)

      expect(wrapper.find('section').hasClass('nf-comments-list')).toBeTruthy()
      expect(wrapper.contains(<p>AAA</p>)).toBeTruthy()
      expect(wrapper.contains(<p>BBB</p>)).toBeTruthy()
      expect(wrapper.contains(<p>CCC</p>)).toBeFalsy()
    })
  })
})
