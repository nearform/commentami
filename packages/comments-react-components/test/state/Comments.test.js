import { commentsCount, selectCommentsByReference } from '../../src/state/selectors'
import { CommentsState, STATE_FIELD_NAME } from '../../src/state/Comments'

import { CommentsInMemoryService } from '../helpers/CommentsInMemoryService'
import { CommentsMockService } from '../helpers/CommentsMockService'
import { CommentsMockServiceWithStream } from '../helpers/CommentsMockServiceWithStream'
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
    comments = new CommentsState({
      service: new CommentsInMemoryService(),
      getProviderState: getState,
      onCommentsStateUpdate: setState,
      resource: 'res-1'
    })
    expect(comments.defaultState).toEqual({ id: 'res-1', references: {} })
  })

  test('if state is null should return a default state', () => {
    state = {}
    comments = new CommentsState({
      service: new CommentsInMemoryService(),
      getProviderState: getState,
      onCommentsStateUpdate: setState,
      resource: 'res-1'
    })
    expect(comments.state).toEqual({ id: 'res-1', references: {} })
  })

  describe('Adding a comment', () => {
    let comment1
    beforeEach(async () => {
      comments = new CommentsState({
        service: new CommentsInMemoryService(),
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })
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
      comments = new CommentsState({
        service: new CommentsInMemoryService(),
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })

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
      comments = new CommentsState({
        service: new CommentsInMemoryService(),
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })

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

  describe('refresh', () => {
    test('Refresh should fill in the comments', async () => {
      const service = new CommentsMockService()
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })

      service.getComments.mockReturnValue([{ id: 'comm-1', content: 'somecontent', reference: 'ref-1' }])
      await comments.subscribe()

      expect(state).toEqual({
        commentsState: {
          id: 'res-1',
          references: {
            'ref-1': {
              id: 'ref-1',
              comments: {
                'comm-1': {
                  author: null,
                  content: 'somecontent',
                  createdAt: null,
                  id: 'comm-1',
                  reference: { id: 'ref-1' }
                }
              }
            }
          }
        }
      })
    })
  })

  describe('subscribe and unsubscribe', () => {
    test('Subscribe with no stream should not call only the getComments', async () => {
      const service = new CommentsMockService()
      service.getComments.mockReturnValue([])
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })


      await comments.subscribe()
      expect(service.getComments).toHaveBeenCalledWith('res-1')
    })

    test('Subscribe with stream should call alse the onResourceChange', async () => {
      const service = new CommentsMockServiceWithStream()
      service.getComments.mockReturnValue([])
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })


      await comments.subscribe()
      expect(service.getComments).toHaveBeenCalledWith('res-1')
      expect(service.onResourceChange).toHaveBeenCalled()
      expect(service.onResourceChange.mock.calls[0][0]).toBe('res-1')
    })

    test('add comment event', async () => {
      const service = new CommentsMockServiceWithStream()
      service.getComments.mockReturnValue([])
      state = {
        commentsState: {
          id: 'res-1',
          references: {
            'ref-1': { comments: {}, id: 'ref-1' }
          }
        }
      }
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })

      await comments.subscribe()

      service.onResourceChange.mock.calls[0][1]({ action: 'add', comment: { id: 'comm-1', reference: 'ref-1' } })

      expect(state).toEqual({
        commentsState: {
          id: 'res-1',
          references: {
            'ref-1': {
              comments: {
                'comm-1': {
                  author: null,
                  content: null,
                  createdAt: null,
                  id: 'comm-1',
                  reference: { id: 'ref-1' }
                }
              },
              id: 'ref-1'
            }
          }
        }
      })
    })

    test('remove comment event', async () => {
      const service = new CommentsMockServiceWithStream()
      service.getComments.mockReturnValue([{ id: 'comm-1', content: 'somecontent', reference: 'ref-1' }])
      state = {
        commentsState: {
          id: 'res-1',
          references: {
            'ref-1': {
              comments: {
                'comm-1': {
                  author: null,
                  content: null,
                  createdAt: null,
                  id: 'comm-1',
                  reference: { id: 'ref-1' }
                }
              },
              id: 'ref-1'
            }
          }
        }
      }

      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })

      await comments.subscribe()

      service.onResourceChange.mock.calls[0][1]({ action: 'delete', comment: { id: 'comm-1', reference: 'ref-1' } })

      expect(state).toEqual({
        commentsState: {
          id: 'res-1',
          references: {
            'ref-1': {
              comments: {},
              id: 'ref-1'
            }
          }
        }
      })
    })

    test('unhandled comment event', async () => {
      const mockLogger = {
        warn: jest.fn()
      }
      const service = new CommentsMockServiceWithStream()
      service.getComments.mockReturnValue([])
      state = {}

      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1',
        logger: mockLogger
      })

      await comments.subscribe()

      service.onResourceChange.mock.calls[0][1]({ action: 'anotheraction' })

      expect(mockLogger.warn).toHaveBeenCalledWith('Event note expected', 'anotheraction')
    })

    test('Unsubscribe without unsubscribe does nothing', async () => {
      const service = new CommentsMockServiceWithStream()
      service.getComments.mockReturnValue([])
      state = {}

      const unsubscribeMock = jest.fn()
      service.onResourceChange.mockReturnValue(unsubscribeMock)
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })

      await comments.subscribe()
      await comments.unsubscribe()

      expect(unsubscribeMock).toHaveBeenCalledWith()
    })
  })
})
