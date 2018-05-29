'use strict'

const { NF_COMMENTS_SERVER_HOST, NF_COMMENTS_SERVER_PORT } = process.env

const config = {
  host: NF_COMMENTS_SERVER_HOST || 'localhost',
  port: NF_COMMENTS_SERVER_PORT || 8080,
  routes: {
    cors: true
  }
}

module.exports = config
