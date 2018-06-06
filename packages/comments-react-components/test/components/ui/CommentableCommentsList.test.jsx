import { mount } from 'enzyme'
import React from 'react'
import { CommentableContext } from '../../../src/components/core/CommentableProvider'
import { CommentableCommentsList } from '../../../src/components/ui/CommentableCommentsList'

function CustomComment({ comment: { content } }) {
  return <p>{content}</p>
}

describe('CommentableCommentsList', () => {
  describe('.render', () => {
    test('should render no comments by default', () => {
      const context = {}

      const wrapper = mount(
        <div>
          <CommentableContext.Provider value={context}>
            <CommentableCommentsList title="FOO" className="CLS" />
          </CommentableContext.Provider>
        </div>
      )

      expect(wrapper.find('section').hasClass('CLS')).toBeTruthy()
      expect(wrapper.contains(<h2 className="nf-comments-list__title">FOO</h2>)).toBeTruthy()
    })

    test('should render comments with the standard component', () => {
      const context = {
        commentsState: {
          comments: [{ reference: 'REFERENCE', id: 1, author: 'author', content: 'content' }]
        }
      }

      const wrapper = mount(
        <div>
          <CommentableContext.Provider value={context}>
            <CommentableCommentsList reference="REFERENCE" />
          </CommentableContext.Provider>
        </div>
      )
      expect(wrapper.find('section').hasClass('nf-comments-list')).toBeTruthy()
      expect(wrapper.contains(<p className="nf-comments-comment__content">content</p>)).toBeTruthy()
    })

    test('should render comments with the custom component', () => {
      const context = {
        commentsState: {
          comments: [
            { reference: 'REFERENCE', id: 1, content: 'AAA' },
            { reference: 'REFERENCE', id: 2, content: 'BBB' },
            { reference: 'ANOTHER-REFERENCE', content: 'CCC' }
          ]
        }
      }

      const wrapper = mount(
        <div>
          <CommentableContext.Provider value={context}>
            <CommentableCommentsList reference="REFERENCE" commentComponent={CustomComment} />
          </CommentableContext.Provider>
        </div>
      )

      expect(wrapper.find('section').hasClass('nf-comments-list')).toBeTruthy()
      expect(wrapper.contains(<p>AAA</p>)).toBeTruthy()
      expect(wrapper.contains(<p>BBB</p>)).toBeTruthy()
      expect(wrapper.contains(<p>CCC</p>)).toBeFalsy()
    })
  })
})
