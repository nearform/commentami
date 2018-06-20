'use strict'

const find = require('lodash/find')

const passwords = {
  filippo: 'filippo',
  paolo: 'paolo',
  davide: 'davide',
  test: 'test'
}

const users = {
  filippo: {
    id: 1,
    username: 'filippo',
    firstName: 'Filippo',
    lastName: 'Test',
    avatarUrl: 'https://api.adorable.io/avatars/285/filippo@commentami.com.png',
    profileUrl: 'https://www.google.com'
  },
  paolo: {
    id: 2,
    username: 'paolo',
    firstName: 'Paolo',
    lastName: 'Test',
    avatarUrl: 'https://api.adorable.io/avatars/285/paolo@commentami.com.png',
    profileUrl: 'https://www.google.com'
  },
  davide: {
    id: 3,
    username: 'davide',
    firstName: 'Davide',
    lastName: 'Test',
    avatarUrl: 'https://api.adorable.io/avatars/285/davide@commentami.com.png',
    profileUrl: 'https://www.google.com'
  },
  test: {
    id: 4,
    username: 'test',
    firstName: 'test',
    lastName: 'test',
    avatarUrl: 'https://api.adorable.io/avatars/285/test@commentami.com.png',
    profileUrl: 'https://www.google.com'
  }
}

function fetchUserById(id) {
  return find(users, { id })
}

function fetchUserByUsername(username) {
  return find(users, { username })
}

const validate = async (request, username, password) => {
  if (!users[username] || !passwords[username]) {
    return { isValid: false }
  }

  const isValid = password === passwords[username]
  if (!isValid) {
    return { isValid: false }
  }

  return { isValid, credentials: users[username] }
}

module.exports = {
  validate,
  fetchUserById,
  fetchUserByUsername
}
