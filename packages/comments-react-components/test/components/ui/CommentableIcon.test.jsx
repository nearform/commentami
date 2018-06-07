import { shallow } from 'enzyme'
import React from 'react'
import { CommentableIcon } from '../../../src/components/ui/CommentableIcon'

describe('CommentableIcon', () => {
  test('should render with good defaults', () => {
    const wrapper = shallow(<CommentableIcon />)

    expect(
      wrapper.equals(
        <svg version="1.1" viewBox="0 0 24 24" className="nf-comments-icon" width={24} height={24}>
          <g>
            <path />
          </g>
        </svg>
      )
    ).toBeTruthy()
  })

  test('should use all properties', () => {
    const wrapper = shallow(<CommentableIcon path="PATH" viewBox="FOO" width={100} height={200} />)

    expect(
      wrapper.equals(
        <svg version="1.1" viewBox="FOO" className="nf-comments-icon" width={100} height={200}>
          <g>
            <path d="PATH" />
          </g>
        </svg>
      )
    ).toBeTruthy()
  })

  test('should ignore width and height when class is passed', () => {
    const wrapper = shallow(<CommentableIcon path="PATH" viewBox="FOO" className="CLS" />)

    expect(
      wrapper.equals(
        <svg version="1.1" viewBox="FOO" className="CLS" width={null} height={null}>
          <g>
            <path d="PATH" />
          </g>
        </svg>
      )
    ).toBeTruthy()
  })
})
