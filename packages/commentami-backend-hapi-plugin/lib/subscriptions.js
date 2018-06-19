'use strict'
const difference = require('lodash/difference')

async function notifyComment(comment, { action } = {}) {
  const server = this

  const log = err => {
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
  if (action === 'add') {
    const mentions = difference(comment.mentions || [], [comment.author])
    for (let user of mentions) {
      notifications.push(server.publishFar(`/users/${user}`, { action: 'mention', comment }).catch(log))
    }

    if (server.commentsService) {
      const involvedUsers = await server.commentsService.getInvolvedUsers(comment)
      for (let user of difference(involvedUsers, [...mentions, comment.author])) {
        notifications.push(server.publishFar(`/users/${user}`, { action: 'response', comment }).catch(log))
      }
    }
  }

  return Promise.all(notifications).catch(log)
}

module.exports = {
  notifyComment
}
