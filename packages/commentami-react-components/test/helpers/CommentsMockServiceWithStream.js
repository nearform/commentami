export const CommentsMockServiceWithStream = () => {
  return {
    addComment: jest.fn(),
    removeComment: jest.fn(),
    getComments: jest.fn(),
    onResourceChange: jest.fn()
  }
}
