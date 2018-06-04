import { commentsCount, selectCommentsByReference } from '../../src/state/selectors'
import { CommentsState, STATE_FIELD_NAME } from '../../src/state/Comments'

import { CommentsInMemoryService } from '../helpers/CommentsInMemoryService'
import { getDefaultState } from '../../src/state/helpers'

describe('state/Comments', () => {
  let state
  let comments
  const setState = newState => (state = Object.assign({}, state, newState))
  const getState = () => state

  beforeEach(() => {
    state = {
      [STATE_FIELD_NAME]: getDefaultState()
    }
  })
  test('The default state should be correct', () => {
    comments = new CommentsState(new CommentsInMemoryService(), getState, setState, 'res-1')
    expect(comments.defaultState).toEqual({ id: 'res-1', references: {} })
  })

  describe('Adding a comment', () => {
    let comment1
    beforeEach(async () => {
      comments = new CommentsState(new CommentsInMemoryService(), getState, setState, 'res-1')
      comment1 = await comments.addComment({
        reference: { id: 'ref-1' },
        content: 'somecontent'
      })
    })

    test('the size should be 1', () => {
      expect(commentsCount(state, { id: 'ref-1' })).toBe(1)
    })

    test('the size of the list of comments related to reference ref-1 should be 1', () => {
      expect(selectCommentsByReference(state, { id: 'ref-1' }).length).toBe(1)
    })

    test('the comment should be added correctly', () => {
      expect(selectCommentsByReference(state, { id: 'ref-1' })[0]).toEqual(comment1)
    })
  })

  describe('Removing a comment', () => {
    beforeEach(async () => {
      comments = new CommentsState(new CommentsInMemoryService(), getState, setState, 'res-1')
      await comments.addComment({
        reference: { id: 'ref-2' },
        content: 'somecontent'
      })
      await comments.addComment({
        reference: { id: 'ref-3' },
        content: 'another'
      })
      await comments.removeComment({
        id: 1,
        reference: { id: 'ref-2' }
      })
    })

    test('the size of the list of comments related to reference ref-2 should be 0', () => {
      expect(selectCommentsByReference(state, { id: 'ref-2' }).length).toBe(0)
    })

    test('the size of the list of comments related to reference ref-3 should be 1', () => {
      expect(selectCommentsByReference(state, { id: 'ref-3' }).length).toBe(1)
    })
  })

  describe('Get comments by reference', () => {
    beforeEach(() => {
      comments = new CommentsState(new CommentsInMemoryService(), getState, setState)
      comments.addComment({ reference: { id: 'ref-1' }, content: 'somecontent 1' })
      comments.addComment({ reference: { id: 'ref-1' }, content: 'somecontent 2' })
      comments.addComment({ reference: { id: 'ref-2' }, content: 'somecontent 3' })
      comments.addComment({ reference: { id: 'ref-2' }, content: 'somecontent 4' })
      comments.addComment({ reference: { id: 'ref-1' }, content: 'somecontent 5' })
    })

    test('the size should be 5', () => {
      expect(commentsCount(state, { id: 'ref-1' })).toBe(3)
    })

    test('the size of the list of comments related to reference res-1 should be 3', () => {
      expect(selectCommentsByReference(state, { id: 'ref-1' }).length).toBe(3)
    })

    test('the size of the list of comments related to reference res-2 should be 2', () => {
      expect(selectCommentsByReference(state, { id: 'ref-2' }).length).toBe(2)
    })

    test('the comments should be returned correctly', () => {
      expect(selectCommentsByReference(state, { id: 'ref-1' })[0].content).toBe('somecontent 1')
      expect(selectCommentsByReference(state, { id: 'ref-1' })[1].content).toBe('somecontent 2')
      expect(selectCommentsByReference(state, { id: 'ref-1' })[2].content).toBe('somecontent 5')
      expect(selectCommentsByReference(state, { id: 'ref-2' })[0].content).toBe('somecontent 3')
      expect(selectCommentsByReference(state, { id: 'ref-2' })[1].content).toBe('somecontent 4')
    })
  })
})
