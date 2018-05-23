'use strict'

const {
  NF_COMMENTS_PGHOST,
  NF_COMMENTS_PGUSER,
  NF_COMMENTS_PGDATABASE,
  NF_COMMENTS_PGPASSWORD,
  NF_COMMENTS_PGPORT
} = process.env

const config = {
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  pg: {
    user: NF_COMMENTS_PGUSER || 'postgres',
    host: NF_COMMENTS_PGHOST || 'localhost',
    database: NF_COMMENTS_PGDATABASE || 'comments-db',
    password: NF_COMMENTS_PGPASSWORD || 'postgres',
    port: NF_COMMENTS_PGPORT || 5433
  }
}

module.exports = config
