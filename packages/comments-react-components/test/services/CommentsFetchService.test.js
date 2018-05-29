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
    expect(fetch.mock.calls[0][0]).toBe('http://localhost/comments?url=some-resource')
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

  test('Call the POST comments endpoint returns the commend added', async () => {
    fetch.mockResponseOnce(JSON.stringify(commentsGETvalid.comments[0]))

    const url = 'some-url'
    const reference = '12345'
    const content = 'some content'

    const result = await commentsFetchService.addComment(url, reference, content)

    expect(fetch.mock.calls.length).toBe(1)
    expect(fetch.mock.calls[0][0]).toBe('http://localhost/comments')
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        reference,
        content,
        author: 'An author' // This value should be removed and get directly from the session in the server
      })
    })

    expect(result).toEqual(commentsGETvalid.comments[0])
  })
})
