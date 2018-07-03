'use strict'

const {
  NF_COMMENTS_SERVER_HOST,
  NF_COMMENTS_SERVER_PORT,
  NF_COMMENTS_SERVER_MULTINES_TYPE,
  NF_COMMENTS_SERVER_MULTINES_HOST,
  NF_COMMENTS_SERVER_MULTINES_PORT
} = process.env

const config = {
  server: {
    host: NF_COMMENTS_SERVER_HOST || 'localhost',
    port: NF_COMMENTS_SERVER_PORT || 8080,
    routes: {
      cors: true
    }
  },
  pluginOptions: {
    notifications: {
      enabled: true,
      endPoint: 'http://localhost:8482/notifications'
    },
    multines: {
      type: NF_COMMENTS_SERVER_MULTINES_TYPE || 'redis',
      host: NF_COMMENTS_SERVER_MULTINES_HOST || '127.0.0.1',
      port: NF_COMMENTS_SERVER_MULTINES_PORT || 6379
    }
  }
}

module.exports = config
