export const selectCommentsByReference = (comments, referenceId) =>
  (comments ? comments.filter(comment => comment.reference === referenceId) : [])
