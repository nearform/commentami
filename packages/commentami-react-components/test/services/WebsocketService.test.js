import commentsGETvalid from './__mocks__/commentsGETvalid'

describe('WebsocketService', () => {
  let mockNesClient
  let client
  let service
  const mockConnect = jest.fn()
  const mockRequest = jest.fn()
  const mockSubscribe = jest.fn()
  const mockUnsubscribe = jest.fn()

  beforeAll(async () => {
    mockNesClient = function() {
      this.connect = mockConnect
      this.request = mockRequest
      this.subscribe = mockSubscribe
      this.unsubscribe = mockUnsubscribe
    }

    jest.mock('nes', () => ({
      Client: mockNesClient
    }))

    client = require('../../src/services/WebsocketService').buildWebsocketClient('ws://localhost/')
    await client.connect()
    service = require('../../src/services/WebsocketService').WebsocketService(client)
  })

  beforeEach(async () => {
    mockConnect.mockReset()
    mockRequest.mockReset()
    mockSubscribe.mockReset()
    mockUnsubscribe.mockReset()
  })

  test.only('Call the GET comments endpoint returns a valid structure', async () => {
    mockRequest.mockReturnValue({ payload: commentsGETvalid })

    // assert on the response
    const result = await service.getComments('some-resource')

    expect(mockRequest.mock.calls.length).toEqual(1)
    expect(mockRequest.mock.calls[0][0]).toEqual('/comments?resource=some-resource')

    expect(result.length).toEqual(3)
    expect(result[0]).toEqual(commentsGETvalid.comments[0])
    expect(result[1]).toEqual(commentsGETvalid.comments[1])
    expect(result[2]).toEqual(commentsGETvalid.comments[2])
  })

  test('Call the DELETE comments endpoint returns a valid structure', async () => {
    await service.removeComment({ id: 'comm-1' })

    expect(mockRequest.mock.calls.length).toEqual(1)
    expect(mockRequest.mock.calls[0][0]).toEqual({ method: 'DELETE', path: '/comments/comm-1' })
  })

  test('Call the POST comments endpoint returns the comment added', async () => {
    const resource = 'res-1'
    const reference = { id: 'ref-10' }
    const content = 'some content'

    const response = {
      id: 3,
      resource,
      reference,
      content,
      author: 'An author',
      createdAt: '2018-05-29T12:48:17.462Z'
    }
    mockRequest.mockReturnValue({ payload: response })

    const result = await service.addComment(resource, { reference, content })

    expect(mockRequest.mock.calls.length).toEqual(1)
    expect(mockRequest.mock.calls[0][0]).toEqual({
      method: 'POST',
      path: '/comments',
      payload: { content: 'some content', reference: 'ref-10', resource: 'res-1' }
    })

    expect(result).toEqual(response)
  })

  test('Subscribe on the channel', async () => {
    const resource = 'res-1'

    const handler = jest.fn()
    const unsubscribe = await service.onResourceChange(resource, handler)

    expect(mockSubscribe.mock.calls.length).toEqual(1)
    expect(mockSubscribe.mock.calls[0][0]).toEqual('/resources/res-1')

    await unsubscribe()
    expect(mockUnsubscribe).toHaveBeenCalledWith('/resources/res-1', handler)
  })

  test('Subscribe on the user', async () => {
    const user = 'test'

    const handler = jest.fn()
    const unsubscribe = await service.onUserNotification(user, handler)

    expect(mockSubscribe.mock.calls.length).toEqual(1)
    expect(mockSubscribe.mock.calls[0][0]).toEqual('/users/test')

    await unsubscribe()
    expect(mockUnsubscribe).toHaveBeenCalledWith('/users/test', handler)
  })

  afterAll(async () => {
    await client.disconnect()
  })
})
