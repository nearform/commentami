import { STATE_FIELD_NAME } from './Comments'

const getCommentsState = state => {
  return state[STATE_FIELD_NAME] || {}
}

export const selectCommentsByReference = (state, referenceId) =>
  (getCommentsState(state).comments || []).filter(comment => comment.reference === referenceId)

export const totalCommentsCount = (state) => (getCommentsState(state).comments || []).length
