import { mount } from 'enzyme'
import React from 'react'
import { CommentsList } from '../../../src/components/ui/CommentsList'
import { withCommentableContext } from '../../helpers/context'

function CustomComment({ comment: { content } }) {
  return <p>{content}</p>
}

describe('CommentsList', () => {
  describe('.render', () => {
    test('should render no comments by default', () => {
      const wrapper = mount(withCommentableContext(<CommentsList title="FOO" className="CLS" />))

      expect(wrapper.find('section').hasClass('CLS')).toBeTruthy()
      expect(wrapper.contains(<h2 className="nf-comments-list__title">FOO</h2>)).toBeTruthy()
    })

    test('should render comments with the standard component', () => {
      const context = {
        commentsState: {
          references: {
            REFERENCE: {
              comments: [{ reference: { id: 'REFERENCE' }, id: 1, content: 'AAA' }]
            }
          }
        }
      }

      const wrapper = mount(withCommentableContext(<CommentsList reference="REFERENCE" />, context))
      expect(wrapper.find('section').hasClass('nf-comments-list')).toBeTruthy()
      expect(wrapper.contains(<p className="nf-comments-comment__content">AAA</p>)).toBeTruthy()
    })

    test('should render comments with the custom component', () => {
      const context = {
        commentsState: {
          references: {
            REFERENCE: {
              comments: [
                { reference: { id: 'REFERENCE' }, id: 1, content: 'AAA' },
                { reference: { id: 'REFERENCE' }, id: 2, content: 'BBB' }
              ]
            },
            'ANOTHER-REFERENCE': {
              comments: [
                {
                  reference: { id: 'ANOTHER-REFERENCE' },
                  id: 3,
                  content: 'CCC'
                }
              ]
            }
          }
        }
      }

      const wrapper = mount(
        withCommentableContext(<CommentsList reference="REFERENCE" commentComponent={CustomComment} />, context)
      )

      expect(wrapper.find('section').hasClass('nf-comments-list')).toBeTruthy()
      expect(wrapper.contains(<p>AAA</p>)).toBeTruthy()
      expect(wrapper.contains(<p>BBB</p>)).toBeTruthy()
      expect(wrapper.contains(<p>CCC</p>)).toBeFalsy()
    })
  })
})
