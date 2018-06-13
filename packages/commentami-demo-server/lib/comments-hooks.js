'use strict'

const { fetchUserById } = require('./auth')

function addUser(comment) {
  const user = fetchUserById(parseInt(comment.author))

  if (user) {
    comment.author = user
  }

  return comment
}

async function fetchedComment(comment) {
  return addUser(comment)
}

async function fetchedComments(comments) {
  return comments.map(comment => addUser(comment))
}

module.exports = {
  fetchedComment,
  fetchedComments
}
