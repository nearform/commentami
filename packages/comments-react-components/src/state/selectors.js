import { STATE_FIELD_NAME } from './Comments'

const getCommentsState = state => {
  return state[STATE_FIELD_NAME] || {}
}

export const selectCommentsByReference = (state, reference) =>
  (getCommentsState(state).comments || []).filter(comment => comment.reference === reference)

export const totalCommentsCount = (state) => (getCommentsState(state).comments || []).length
