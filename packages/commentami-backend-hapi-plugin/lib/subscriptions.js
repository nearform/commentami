'use strict'
const _get = require('lodash/get')
const _difference = require('lodash/difference')

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

  return Promise.all(notifications).catch(log)
}

async function notifyUser(comment, resolveUrl) {
  const server = this

  const log = err => {
    server.log(['subscription', 'error'], err)
  }

  const notifications = []
  const baseUrl = await resolveUrl(comment)
  const url =
    `${baseUrl}?resource=${encodeURIComponent(comment.resource)}` +
    `&reference=${encodeURIComponent(comment.reference)}&` +
    `comment=${encodeURIComponent(comment.id)}`

  const mentions = _difference(_get(comment, 'mentions', []), [comment.author])
  for (let user of mentions) {
    notifications.push(server.publishFar(`/users/${user}`, { action: 'mentioned', comment, url }).catch(log))
  }

  const involvedUsers = await server.commentsService.getInvolvedUsers(comment)
  for (let user of _difference(involvedUsers, [...mentions, comment.author])) {
    notifications.push(server.publishFar(`/users/${user}`, { action: 'involved', comment, url }).catch(log))
  }

  return Promise.all(notifications).catch(log)
}

module.exports = {
  notifyComment,
  notifyUser
}
