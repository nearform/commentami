'use strict'

const { fetchUserByUsername } = require('./auth')

function addUser(comment) {
  const user = fetchUserByUsername(comment.author.username)

  if (user) {
    comment.author = user
  }

  if (comment.mentions && comment.mentions.length > 0) {
    comment.mentions = comment.mentions
      .map(mention => {
        return fetchUserByUsername(mention.username)
      })
      .filter(v => !!v)
  }

  return comment
}

async function fetchedComment(comment) {
  return addUser(comment)
}

async function fetchedComments(comments) {
  return comments.map(comment => addUser(comment))
}

async function involvedUsers(users) {
  return users.map(user => fetchUserByUsername(user.username))
}

module.exports = {
  fetchedComment,
  fetchedComments,
  involvedUsers
}
