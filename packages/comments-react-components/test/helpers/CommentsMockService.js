export const CommentsMockService = () => {
  return {
    addComment: jest.fn().mockReturnValue({ id: 1 }),
    removeComment: jest.fn(),
    getComments: jest.fn()
  }
}
