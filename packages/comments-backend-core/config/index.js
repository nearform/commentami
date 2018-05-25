'use strict'

const { NF_COMMENTS_PGHOST, NF_COMMENTS_PGUSER, NF_COMMENTS_PGDATABASE, NF_COMMENTS_PGPASSWORD, NF_COMMENTS_PGPORT } = process.env

const isTest = process.env.NODE_ENV === 'test'

const config = {
  isProd: process.env.NODE_ENV === 'production',
  isTest,
  pg: {
    user: NF_COMMENTS_PGUSER || 'postgres',
    host: NF_COMMENTS_PGHOST || 'localhost',
    database: NF_COMMENTS_PGDATABASE || (isTest ? 'comments_test' : 'comments'),
    password: NF_COMMENTS_PGPASSWORD || 'postgres',
    port: NF_COMMENTS_PGPORT || 5432
  }
}

module.exports = config
