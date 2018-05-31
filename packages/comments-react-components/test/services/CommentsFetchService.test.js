import { CommentsFetchService } from '../../src/services/CommentsFetchService'

import commentsGETvalid from './__mocks__/commentsGETvalid'

global.fetch = require('jest-fetch-mock')

describe('CommentsFetchServer', () => {
  let commentsFetchService
  beforeEach(() => {
    fetch.resetMocks()

    commentsFetchService = CommentsFetchService('http://localhost/')
  })

  test('Call the GET comments endpoint returns a valid structure', async () => {
    fetch.mockResponseOnce(JSON.stringify(commentsGETvalid))

    // assert on the response
    const result = await commentsFetchService.getComments('some-resource')

    expect(fetch.mock.calls.length).toBe(1)
    expect(fetch.mock.calls[0][0]).toBe('http://localhost/comments?resource=some-resource')
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    expect(result.length).toBe(3)
    expect(result[0]).toEqual(commentsGETvalid.comments[0])
    expect(result[1]).toEqual(commentsGETvalid.comments[1])
    expect(result[2]).toEqual(commentsGETvalid.comments[2])
  })

  test('Call the DELETE comments endpoint returns a valid structure', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: true }))

    await commentsFetchService.removeComment('comm-1')

    expect(fetch.mock.calls.length).toBe(1)
    expect(fetch.mock.calls[0][0]).toBe('http://localhost/comments/comm-1')
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
  })

  test('Call the POST comments endpoint returns the commend added', async () => {
    const resource = 'page-1'
    const reference = 'block-10'
    const content = 'some content'

    const response = {
      id: 3,
      resource,
      reference,
      content,
      author: 'An author',
      createdAt: '2018-05-29T12:48:17.462Z'
    }
    fetch.mockResponseOnce(JSON.stringify(response))

    const result = await commentsFetchService.addComment({resource, reference, content})

    expect(fetch.mock.calls.length).toBe(1)
    expect(fetch.mock.calls[0][0]).toBe('http://localhost/comments')
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resource,
        reference,
        content,
        author: 'An author' // This value should be removed and get directly from the session in the server
      })
    })

    expect(result).toEqual(response)
  })
})
