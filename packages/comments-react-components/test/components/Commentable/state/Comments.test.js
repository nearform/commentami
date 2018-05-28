import { Comments } from '../../../../src/components/Commentable/state/Comments'

import { CommentsInMemoryService } from '../../../../src/services/CommentsInMemoryService'

describe('Comments', () => {
  describe('When a new instance is created', () => {
    let comments
    beforeEach(() => {
      comments = new Comments()
    })

    test('the size should be 0', () => {
      expect(comments.size()).toBe(0)
    })
  })

  describe('Adding a comment', () => {
    let comments
    beforeEach(async () => {
      comments = new Comments(new CommentsInMemoryService())
      await comments.addComment({
        url: 'url1',
        reference: 'comm-1',
        content: 'somecontent'
      })
    })

    test('the size should be 1', () => {
      expect(comments.size()).toBe(1)
    })

    test('the size of the list of comments related to block comm-1 should be 1', () => {
      expect(comments.getBlockComments('comm-1').length).toBe(1)
    })

    test('the comment should be added correctly', () => {
      expect(comments.getBlockComments('comm-1')[0]).toEqual({
        author: 'someauthor',
        content: 'somecontent',
        id: 12,
        reference: 'comm-1'
      })
    })
  })

  describe('Get comments by block', () => {
    let comments
    beforeEach(() => {
      comments = new Comments(new CommentsInMemoryService())
      comments.addComment({ url: 'url1', reference: 'comm-1', content: 'somecontent 1' })
      comments.addComment({ url: 'url1', reference: 'comm-1', content: 'somecontent 2' })
      comments.addComment({ url: 'url1', reference: 'comm-2', content: 'somecontent 3' })
      comments.addComment({ url: 'url1', reference: 'comm-2', content: 'somecontent 4' })
      comments.addComment({ url: 'url1', reference: 'comm-1', content: 'somecontent 5' })
    })

    test('the size should be 5', () => {
      expect(comments.size()).toBe(5)
    })

    test('the size of the list of comments related to block comm-1 should be 3', () => {
      expect(comments.getBlockComments('comm-1').length).toBe(3)
    })

    test('the size of the list of comments related to block comm-2 should be 2', () => {
      expect(comments.getBlockComments('comm-2').length).toBe(2)
    })

    test('the comments should be returned correctly', () => {
      expect(comments.getBlockComments('comm-1')[0].content).toBe('somecontent 1')
      expect(comments.getBlockComments('comm-1')[1].content).toBe('somecontent 2')
      expect(comments.getBlockComments('comm-1')[2].content).toBe('somecontent 5')

      expect(comments.getBlockComments('comm-2')[0].content).toBe('somecontent 3')
      expect(comments.getBlockComments('comm-2')[1].content).toBe('somecontent 4')
    })
  })
})
