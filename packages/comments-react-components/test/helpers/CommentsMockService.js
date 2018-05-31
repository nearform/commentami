export const CommentsMockService = () => {
  return {
    addComment: jest.fn(),
    removeComment: jest.fn(),
    getComments: jest.fn()
  }
}
