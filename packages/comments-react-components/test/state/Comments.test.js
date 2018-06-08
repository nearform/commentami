import { CommentsState, STATE_FIELD_NAME } from '../../src/state/Comments'
import { commentsCount, selectCommentsByReference } from '../../src/state/selectors'
import { CommentsInMemoryService } from '../helpers/CommentsInMemoryService'
import { CommentsMockService } from '../helpers/CommentsMockService'
import { CommentsMockServiceWithStream } from '../helpers/CommentsMockServiceWithStream'
import { getDefaultState, initializeSuccess, updating } from '../../src/state/reducers'
import { UPDATE_IN_PROGRESS_ERROR } from '../../src/state/errors'

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
    expect(comments.defaultState).toEqual({
      fetchError: null,
      id: 'res-1',
      initError: null,
      isFetching: false,
      isInit: false,
      isUpdating: false,
      references: {},
      updateError: null
    })
  })

  test('if state is null should return a default state', () => {
    state = {}
    comments = new CommentsState({
      service: new CommentsInMemoryService(),
      getProviderState: getState,
      onCommentsStateUpdate: setState,
      resource: 'res-1'
    })
    expect(comments.state).toEqual({
      fetchError: null,
      id: 'res-1',
      initError: null,
      isFetching: false,
      isInit: false,
      isUpdating: false,
      references: {},
      updateError: null
    })
  })

  describe('Adding a comment', () => {
    beforeEach(async () => {
      comments = new CommentsState({
        service: new CommentsInMemoryService(),
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })
    })
    describe('When is not updating', () => {
      let comment1
      beforeEach(async () => {
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

    test('If the addComment fails should set the error', async () => {
      const service = new CommentsMockService()
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })

      service.addComment.mockImplementation(() => {
        throw new Error('Some error')
      })
      await comments.addComment({
        reference: { id: 'ref-1' },
        content: 'somecontent'
      })
      expect(state.commentsState.updateError.message).toBe('Some error')
      expect(state.commentsState.isUpdating).toBeFalsy()
    })

    test('if the isUpdating is true the comment is not added and an error is thrown', async () => {
      comments = new CommentsState({
        service: new CommentsInMemoryService(),
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })

      comments.updateState(updating(state))
      expect.assertions(2)
      try {
        await comments.addComment({
          reference: { id: 'ref-1' },
          content: 'somecontent'
        })
      } catch (e) {
        expect(e.code).toBe(UPDATE_IN_PROGRESS_ERROR)
      }
      expect(commentsCount(state, { id: 'ref-1' })).toBe(0)
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
    })

    describe('When is not updating', () => {
      beforeEach(async () => {
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

    test('If the removeComment fails should set the error', async () => {
      const service = new CommentsMockService()
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })
      service.removeComment.mockImplementation(() => {
        throw new Error('Some error')
      })
      await comments.removeComment({
        reference: { id: 'ref-1' },
        content: 'somecontent'
      })
      expect(state.commentsState.updateError.message).toBe('Some error')
      expect(state.commentsState.isUpdating).toBeFalsy()
    })

    test('if the isUpdating is true the comment is not added and an error is thrown', async () => {
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
      comments.updateState(updating(state))
      expect.assertions(2)
      try {
        await comments.removeComment({
          id: 1,
          reference: { id: 'ref-2' }
        })
      } catch (e) {
        expect(e.code).toBe(UPDATE_IN_PROGRESS_ERROR)
      }
      expect(commentsCount(state, { id: 'ref-2' })).toBe(1)
    })
  })

  describe('Get comments by reference', () => {
    beforeEach(async () => {
      comments = new CommentsState({
        service: new CommentsInMemoryService(),
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })

      await comments.addComment({ reference: { id: 'ref-1' }, content: 'somecontent 1' })
      await comments.addComment({ reference: { id: 'ref-1' }, content: 'somecontent 2' })
      await comments.addComment({ reference: { id: 'ref-2' }, content: 'somecontent 3' })
      await comments.addComment({ reference: { id: 'ref-2' }, content: 'somecontent 4' })
      await comments.addComment({ reference: { id: 'ref-1' }, content: 'somecontent 5' })
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
      comments.updateState(initializeSuccess())

      service.getComments.mockReturnValue([{ id: 'comm-1', content: 'somecontent', reference: 'ref-1' }])
      await comments.refresh()
      expect(state).toEqual({
        commentsState: {
          fetchError: null,
          id: 'res-1',
          initError: null,
          isFetching: false,
          isInit: true,
          isUpdating: false,
          references: {
            'ref-1': {
              comments: {
                'comm-1': {
                  author: null,
                  content: 'somecontent',
                  createdAt: null,
                  id: 'comm-1',
                  reference: { id: 'ref-1' }
                }
              },
              id: 'ref-1'
            }
          },
          updateError: null
        }
      })
    })

    test('If the getComments fails should set the error', async () => {
      const service = new CommentsMockService()
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })
      comments.updateState(initializeSuccess())

      service.getComments.mockImplementation(() => {
        throw new Error('Some error')
      })
      await comments.refresh()
      expect(state.commentsState.fetchError.message).toBe('Some error')
      expect(state.commentsState.isFetching).toBeFalsy()
    })

    test('If the getComments fails and the param isSubscribing is set to true should throw the error', async () => {
      const service = new CommentsMockService()
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })
      comments.updateState(initializeSuccess())

      service.getComments.mockImplementation(() => {
        throw new Error('Some error')
      })

      expect.assertions(1)
      try {
        await comments.refresh(true)
      } catch (e) {
        expect(e.message).toBe('Some error')
      }
    })

    test('While is fetching the isFetching should be true', async () => {
      const service = new CommentsMockService()
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })
      comments.updateState(initializeSuccess())

      service.getComments.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => {
              resolve([{ id: 'comm-1', content: 'somecontent', reference: 'ref-1' }])
            }, 50)
          )
      )

      const result = comments.refresh()
      expect(state.commentsState.isFetching).toBeTruthy()

      await result
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

    test('If the getComments fails should set the error', async () => {
      const service = new CommentsMockService()
      comments = new CommentsState({
        service,
        getProviderState: getState,
        onCommentsStateUpdate: setState,
        resource: 'res-1'
      })
      comments.updateState(initializeSuccess())

      service.getComments.mockImplementation(() => {
        throw new Error('Some error')
      })
      await comments.subscribe()
      expect(state.commentsState.initError.message).toBe('Some error')
      expect(state.commentsState.isInit).toBeFalsy()
    })

    test('Subscribe with stream should call also the onResourceChange', async () => {
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
          fetchError: null,
          id: 'res-1',
          initError: null,
          isFetching: false,
          isInit: true,
          references: {
            'ref-1': {
              comments: {
                'comm-1': { author: null, content: null, createdAt: null, id: 'comm-1', reference: { id: 'ref-1' } }
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
          fetchError: null,
          id: 'res-1',
          initError: null,
          isFetching: false,
          isInit: true,
          references: { 'ref-1': { comments: {}, id: 'ref-1' } }
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

  describe('Selectors', () => {
    test('should always return something', () => {
      expect(selectCommentsByReference({})).toEqual([])
    })
  })
})
