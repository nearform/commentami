/* globals localStorage */

export function localStorageService() {
  return {
    addComment(resource, comment) {
      const key = `comments:${resource}`
      const raw = localStorage.getItem(key) || '[]'
      const existing = JSON.parse(raw)

      const created = {
        id: new Date().getTime(),
        resource: resource,
        reference: comment.reference.id,
        content: comment.content,
        author: 'someauthor'
      }
      existing.push(created)
      localStorage.setItem(key, JSON.stringify(existing))

      return created
    },

    removeComment(comment) {
      const id = comment.id
      const key = `comments:${comment.resource}`
      const raw = localStorage.getItem(key) || '[]'
      let existing = JSON.parse(raw)

      existing = existing.filter(c => c.id !== id)

      localStorage.setItem(key, JSON.stringify(existing))
    },

    getComments(resource) {
      const raw = localStorage.getItem(`comments:${resource}`) || '[]'

      return JSON.parse(raw)
    }
  }
}
