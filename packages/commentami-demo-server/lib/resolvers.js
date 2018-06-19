'use strict'

async function resolveUrl(comment) {
  const baseUrl = 'http://localhost:4200/'
  switch (comment.resource) {
    case 'multiple-1':
    case 'multiple-2':
    case 'multiple-3':
      return `${baseUrl}multiple`
    case 'markdown-1':
      return `${baseUrl}markdown`
    case 'plain-1':
      return `${baseUrl}plain`
    case 'table-1':
    case 'table-2':
      return `${baseUrl}table`
    default:
      return 'Resource not available'
  }
}

module.exports = {
  resolveUrl
}
