'use strict'

const { fetchUserById, fetchUserByUsername } = require('./auth')

function addUser(comment) {
  const user = fetchUserById(parseInt(comment.author))

  if (user) {
    comment.author = user
  }

  if (comment.mentions && comment.mentions.length > 0) {
    comment.mentions = comment.mentions
      .map(mention => {
        return fetchUserByUsername(mention)
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
  return users.map(user => fetchUserById(parseInt(user)))
}

module.exports = {
  fetchedComment,
  fetchedComments,
  involvedUsers
}
