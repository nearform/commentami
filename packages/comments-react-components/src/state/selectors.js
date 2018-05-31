export const selectCommentsByReference = (state, referenceId) =>
  (state.comments || []).filter(comment => comment.reference === referenceId)

export const totalCommentsCount = (state) => (state.comments || []).length
