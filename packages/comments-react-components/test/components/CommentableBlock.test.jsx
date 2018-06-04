import React from 'react'
import { mount } from 'enzyme'

import { CommentableBlockComponent } from '../../src/components/CommentableBlock'
import { CommentsInMemoryService } from '../helpers/CommentsInMemoryService'
import { CommentsState } from '../../src/state/Comments'

describe('CommentableBlock', () => {
  let events
  let wrapper
  let commentableState

  const setState = newState => {
    commentableState = Object.assign({}, commentableState, newState)
  }

  const getState = () => commentableState

  beforeEach(() => {
    events = {
      onClick: jest.fn(),
      onContextMenu: jest.fn(),
      onDoubleClick: jest.fn(),
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
      onSelect: jest.fn()
    }

    commentableState = {
      lastResourceRefreshed: { id: 'res-1' },
      toggledReference: { id: 'ref-1' },
      toggleComments: jest.fn(),
      addComment: jest.fn(),
      removeComment: jest.fn(),
      getReferenceComments: jest.fn()
    }
  })

  test('if comments are present the block should contain a marker', async () => {
    const commentObject = new CommentsState(new CommentsInMemoryService(), getState, setState)
    await commentObject.addComment({ resource: { id: 'res-1' }, reference: { id: 'ref-1' }, content: 'This is a comment' })
    await commentObject.addComment({ resource: { id: 'res-1' }, reference: { id: 'ref-1' }, content: 'This is a comment 2' })
    await commentObject.addComment({ resource: { id: 'res-1' }, reference: { id: 'ref-1' }, content: 'This is a comment 3' })

    wrapper = mount(
      <CommentableBlockComponent referenceId="ref-1" commentable={commentableState} events={events}>
        <div className="my-content">Some content</div>
      </CommentableBlockComponent>
    )
    expect(wrapper.find('CommentableMarker').length).toBe(1)
  })

  test('if comments are not present the block should not contain a marker', () => {
    wrapper = mount(
      <CommentableBlockComponent referenceId="ref-1" commentable={commentableState} events={events}>
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
      <CommentableBlockComponent referenceId="ref-1" events={events}>
        <div className="my-content">Some content</div>
      </CommentableBlockComponent>
    )

    expect(mockWarning).toHaveBeenCalledWith('Warning: The CommentableBlock component should be inside a CommentableProvider')
    console.error = tempConsoleError // eslint-disable-line
  })

  test('if the component is toggled then the classname should be highlighted', () => {
    commentableState.getReferenceComments.mockReturnValue([])

    wrapper = mount(
      <CommentableBlockComponent
        referenceId="ref-1"
        className="classname"
        highlightedClassName="highlighted-classname"
        commentable={Object.assign({}, commentableState, { toggledReference: { id: 'ref-1' } })}
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
    commentableState.getReferenceComments.mockReturnValue([])

    wrapper = mount(
      <CommentableBlockComponent
        referenceId="ref-1"
        className="classname"
        highlightedClassName="highlighted-classname"
        commentable={Object.assign({}, commentableState, { toggledReference: 'ref-2' })}
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
