'use strict'

function notifyComment (comment, { action } = {}) {
  const server = this

  const log = (err) => {
    server.log(['subscription', 'error'], err)
  }

  if (!action) {
    return Promise.resolve()
  }

  const event = {
    comment,
    action
  }

  const notifications = [
    server.publishFar(`/resources/${comment.resource}`, event).catch(log),
    server.publishFar(`/resources-reference/${comment.reference}/${comment.resource}`, event).catch(log)
  ]

  return Promise.all(notifications).catch(log)
}

module.exports = {
  notifyComment
}
