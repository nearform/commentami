import React from 'react'
import { mount } from 'enzyme'

import { CommentableBlockComponent } from '../../src/components/CommentableBlock'

describe('CommentableBlockComponent', () => {
  let commentable
  let events
  let wrapper

  beforeEach(() => {
    events = {
      onClick: jest.fn(),
      onContextMenu: jest.fn(),
      onDoubleClick: jest.fn(),
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
      onSelect: jest.fn()
    }

    commentable = {
      toggledReference: 'block-1',
      toggleComments: jest.fn(),
      addComment: jest.fn(),
      removeComment: jest.fn(),
      getReferenceComments: jest.fn()
    }
  })

  test('if comments are present the block should contain a marker', () => {
    commentable.getReferenceComments.mockReturnValue([
      { id: 1, content: 'This is a comment', author: 'Davide' },
      { id: 2, content: 'This is a comment', author: 'Paolo' },
      { id: 3, content: 'This is a comment', author: 'Filippo' }
    ])
    wrapper = mount(
      <CommentableBlockComponent referenceId="block-1" commentable={commentable} events={events}>
        <div className="my-content">Some content</div>
      </CommentableBlockComponent>
    )
    expect(wrapper.find('CommentableMarker').length).toBe(1)
  })

  test('if comments are not present the block should not contain a marker', () => {
    commentable.getReferenceComments.mockReturnValue([])
    wrapper = mount(
      <CommentableBlockComponent referenceId="block-1" commentable={commentable} events={events}>
        <div className="my-content">Some content</div>
      </CommentableBlockComponent>
    )
    expect(wrapper.find('CommentableMarker').length).toBe(0)
  })

  test("if the component doesn't have a commentable context should not render and send a warning", () => {
    const mockWarning = jest.fn()
    const tempConsoleError = console.error // eslint-disable-line
    console.error = mockWarning // eslint-disable-line

    wrapper = mount(
      <CommentableBlockComponent referenceId="block-1" events={events}>
        <div className="my-content">Some content</div>
      </CommentableBlockComponent>
    )

    expect(mockWarning).toHaveBeenCalledWith('Warning: The CommentableBlock component should be inside a CommentableProvider')
    console.error = tempConsoleError // eslint-disable-line
  })

  test('if the component is toggled then the classname should be highlighted', () => {
    commentable.getReferenceComments.mockReturnValue([])

    wrapper = mount(
      <CommentableBlockComponent
        referenceId="block-1"
        className="classname"
        highlightedClassName="highlighted-classname"
        commentable={Object.assign({}, commentable, { toggledReference: 'block-1' })}
        events={events}
      >
        <div className="my-content">Some content</div>
      </CommentableBlockComponent>
    )

    expect(
      wrapper
        .find('div')
        .at(0)
        .hasClass('classname')
    ).toBeFalsy()
    expect(
      wrapper
        .find('div')
        .at(0)
        .hasClass('highlighted-classname')
    ).toBeTruthy()
  })

  test('if the component is toggled then the classname should be highlighted', () => {
    commentable.getReferenceComments.mockReturnValue([])

    wrapper = mount(
      <CommentableBlockComponent
        referenceId="block-1"
        className="classname"
        highlightedClassName="highlighted-classname"
        commentable={Object.assign({}, commentable, { toggledReference: 'block-2' })}
        events={events}
      >
        <div className="my-content">Some content</div>
      </CommentableBlockComponent>
    )

    expect(
      wrapper
        .find('div')
        .at(0)
        .hasClass('highlighted-classname')
    ).toBeFalsy()
    expect(
      wrapper
        .find('div')
        .at(0)
        .hasClass('classname')
    ).toBeTruthy()
  })
})
