export const UPDATE_IN_PROGRESS_ERROR = 'UPDATE_IN_PROGRESS_ERROR'

export class CommentsStateError extends Error {
  constructor(message, code) {
    super(message)
    this.name = this.constructor.name
    this.code = code
  }
}
