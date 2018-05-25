'use strict'

const { start } = require('./server.js')

process.on('unhandledRejection', (err) => {
  console.log(err) // eslint-disable-line no-console
  process.exit(1)
})

start()
