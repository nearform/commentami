/* globals localStorage */

export function localStorageService() {
  return {
    addComment(comment) {
      const key = `comments:${comment.resource}`
      const raw = localStorage.getItem(key) || '[]'
      const existing = JSON.parse(raw)

      existing.push({ id: new Date().getTime(), resource: comment.resource, reference: comment.reference, content: comment.content, author: 'someauthor' })
      localStorage.setItem(key, JSON.stringify(existing))
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
