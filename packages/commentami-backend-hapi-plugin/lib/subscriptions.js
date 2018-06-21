'use strict'

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
  let url = null
  if (resolveUrl) {
    const baseUrl = await resolveUrl(comment)
    url =
      `${baseUrl}?resource=${encodeURIComponent(comment.resource)}` +
      `&reference=${encodeURIComponent(comment.reference)}&` +
      `comment=${encodeURIComponent(comment.id)}`
  }

  const mentions = comment.mentions || []
  const filteredMentions = mentions.filter(mention => mention.username !== comment.author.username)

  const userMentioned = []
  for (let user of filteredMentions) {
    userMentioned.push(user.username)
    notifications.push(server.publishFar(`/users/${user.username}`, { action: 'mention', comment, url }).catch(log))
  }

  const involvedUsers = await server.commentsService.getInvolvedUsers(comment)

  for (let user of involvedUsers) {
    if (!userMentioned.includes(user.username) && comment.author.username !== user.username) {
      notifications.push(server.publishFar(`/users/${user.username}`, { action: 'involve', comment, url }).catch(log))
    }
  }

  return Promise.all(notifications).catch(log)
}

module.exports = {
  notifyComment,
  notifyUser
}
