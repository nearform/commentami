'use strict'

const { start } = require('./server.js')

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
});

start()
