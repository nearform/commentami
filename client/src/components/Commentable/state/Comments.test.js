import { Comment, Comments } from './Comments'

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
    let addedComment
    beforeEach(() => {
      comments = new Comments()
      addedComment = new Comment(
        1,
        { block: 'comm-1' },
        'somecontent',
        'someauthor'
      )
      comments.addComment(addedComment)
    })

    test('the size should be 1', () => {
      expect(comments.size()).toBe(1)
    })

    test('the size of the list of comments related to block comm-1 should be 1', () => {
      expect(comments.getBlockComments('comm-1').length).toBe(1)
    })

    test('the comment should be added correctly', () => {
      expect(comments.getBlockComments('comm-1')[0]).toEqual(addedComment)
    })
  })

  describe('Get comments by block', () => {
    let comments
    beforeEach(() => {
      comments = new Comments()
      comments.addComment(
        new Comment(1, { block: 'comm-1' }, 'somecontent 1', 'someauthor 1')
      )
      comments.addComment(
        new Comment(1, { block: 'comm-1' }, 'somecontent 2', 'someauthor 2')
      )
      comments.addComment(
        new Comment(1, { block: 'comm-2' }, 'somecontent 3', 'someauthor 3')
      )
      comments.addComment(
        new Comment(1, { block: 'comm-2' }, 'somecontent 4', 'someauthor 4')
      )
      comments.addComment(
        new Comment(1, { block: 'comm-1' }, 'somecontent 5', 'someauthor 5')
      )
    })

    test('the size should be 5', () => {
      expect(comments.size()).toBe(5)
    })

    test('the size of the list of comments related to block comm-1 should be 3', () => {
      expect(comments.getBlockComments('comm-1').length).toBe(3)
    })

    test('the size of the list of comments related to block comm-2 should be 2', () => {
      expect(comments.getBlockComments('comm-1').length).toBe(3)
    })

    test('the comments should be returned correctly', () => {
      expect(comments.getBlockComments('comm-1')[0].content).toBe(
        'somecontent 1'
      )
      expect(comments.getBlockComments('comm-1')[1].content).toBe(
        'somecontent 2'
      )
      expect(comments.getBlockComments('comm-1')[2].content).toBe(
        'somecontent 5'
      )

      expect(comments.getBlockComments('comm-2')[0].content).toBe(
        'somecontent 3'
      )
      expect(comments.getBlockComments('comm-2')[1].content).toBe(
        'somecontent 4'
      )
    })
  })
})
