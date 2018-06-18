'use strict'

const uniq = require('lodash/uniq')

function parse(text) {
  if (typeof text !== 'string' || !text) {
    return []
  }

  const re = /^@\w+|\s@\w+/g
  const mentions = text.match(re)

  if (!mentions) {
    return []
  }

  return uniq(mentions.map(m => m.replace('@', '').trim()))
}

module.exports = {
  parse
}
