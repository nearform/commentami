import { selectCommentsByReference, totalCommentsCount } from '../../src/state/selectors'
import { CommentsState, STATE_FIELD_NAME } from '../../src/state/Comments'

import { CommentsInMemoryService } from '../helpers/CommentsInMemoryService'

describe('Comments', () => {
  let state
  const setState = newState => (state = Object.assign({}, state, newState))
  const getState = () => state

  beforeEach(() => {
    state = {
      [STATE_FIELD_NAME]: {}
    }
  })

  describe('When a new instance is created', () => {
    test('the size should be 0 and should have a defaut state', () => {
      expect(totalCommentsCount(state)).toBe(0)
    })

    test('should have a fallback state and a default state', () => {
      const comments = new CommentsState(new CommentsInMemoryService(), () => ({}), setState)
      expect(comments.state).toEqual({})
      expect(comments.defaultState).toEqual({ comments: [] })
    })
  })

  describe('Adding a comment', () => {
    let comments

    beforeEach(async () => {
      comments = new CommentsState(new CommentsInMemoryService(), getState, setState)
      await comments.addComment({
        resource: 'page-1',
        reference: 'comm-1',
        content: 'somecontent'
      })
    })

    test('the size should be 1', () => {
      expect(totalCommentsCount(state)).toBe(1)
    })

    test('the size of the list of comments related to reference comm-1 should be 1', () => {
      expect(selectCommentsByReference(state, 'comm-1').length).toBe(1)
    })

    test('the comment should be added correctly', () => {
      expect(selectCommentsByReference(state, 'comm-1')[0]).toEqual({
        author: 'someauthor',
        content: 'somecontent',
        id: 1,
        reference: 'comm-1',
        resource: 'page-1'
      })
    })
  })

  describe('Removing a comment', () => {
    let comments
    beforeEach(async () => {
      comments = new CommentsState(new CommentsInMemoryService(), getState, setState)
      await comments.addComment({
        resource: 'page-1',
        reference: 'comm-2',
        content: 'somecontent'
      })
      await comments.addComment({
        resource: 'page-1',
        reference: 'comm-3',
        content: 'another'
      })
      await comments.removeComment({
        id: 1,
        resource: 'page-1'
      })
    })

    test('the size should be 1', () => {
      expect(totalCommentsCount(state)).toBe(1)
    })

    test('the size of the list of comments related to reference comm-1 should be 1', () => {
      expect(selectCommentsByReference(state, 'comm-2').length).toBe(0)
      expect(selectCommentsByReference(state, 'comm-3').length).toBe(1)
    })
  })

  describe('Get comments by reference', () => {
    let comments
    beforeEach(() => {
      comments = new CommentsState(new CommentsInMemoryService(), getState, setState)
      comments.addComment({ url: 'url1', reference: 'comm-1', content: 'somecontent 1' })
      comments.addComment({ url: 'url1', reference: 'comm-1', content: 'somecontent 2' })
      comments.addComment({ url: 'url1', reference: 'comm-2', content: 'somecontent 3' })
      comments.addComment({ url: 'url1', reference: 'comm-2', content: 'somecontent 4' })
      comments.addComment({ url: 'url1', reference: 'comm-1', content: 'somecontent 5' })
    })

    test('the size should be 5', () => {
      expect(totalCommentsCount(state)).toBe(5)
    })

    test('the size of the list of comments related to reference comm-1 should be 3', () => {
      expect(selectCommentsByReference(state, 'comm-1').length).toBe(3)
    })

    test('the size of the list of comments related to reference comm-2 should be 2', () => {
      expect(selectCommentsByReference(state, 'comm-2').length).toBe(2)
    })

    test('the comments should be returned correctly', () => {
      expect(selectCommentsByReference(state, 'comm-1')[0].content).toBe('somecontent 1')
      expect(selectCommentsByReference(state, 'comm-1')[1].content).toBe('somecontent 2')
      expect(selectCommentsByReference(state, 'comm-1')[2].content).toBe('somecontent 5')

      expect(selectCommentsByReference(state, 'comm-2')[0].content).toBe('somecontent 3')
      expect(selectCommentsByReference(state, 'comm-2')[1].content).toBe('somecontent 4')
    })
  })

  describe('Selectors', () => {
    test('should always return something', () => {
      expect(selectCommentsByReference({})).toEqual([])
    })
  })
})
