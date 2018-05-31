# @nearform/comments-backend-hapi-plugin

`@nearform/comments-backend-hapi-plugin` is a plugin to add the comments REST API to a [Hapi][hapi] server.

## Install

To install via npm:

```
npm install @nearform/comments-backend-hapi-plugin
```

## Usage

```javascript
const main = async function() {
  const server = require('hapi').Server({ host: 'localhost', port: 80 })

  const options = {
    // hooks to decorate comments (ie: adding user data)
    fetchedComment: [async] (comment) => { ... }, // optional async function or function returning a Promise
    fetchedComments: [async] (comments) => { ... }, // optional async function or function returning a Promise

    // override comments-core db configuration
    pg : {
      host: '127.0.0.1',
      port: 5432
    },

    // enable websocket and pass the configuration for multines (mqemitter or redis or mongo)
    disableWebsocket: false,
    multines: {
      type: 'redis',
      host: '127.0.0.1',
      port: 6379
    }
  }

  await server.register([
    {
      plugin: require('@nearform/comments-backend-hapi-plugin', options)
    }
  ])

  await server.start()
  logMessage(`Server running at: ${server.info.uri}`)
}

main().catch(console.error)
```

Comments route will be then accessible on the `/comments` path.

### Hooks

When adding the `comments-backend-hapi-plugin` you can pass some hooks. These hooks should be intended as decorators of a single comment (`fetchedComment`) or a list of comments (`fetchedComments`).

Those 2 functions should be either async or return a promise that will yeld the final augmented comment/comments list as its result.

## Run tests

You will need a postgres server up and running.

To create the db needed for the tests you can use the following command

```
npm run pg:test:init
```

and the run

```
npm test
```

To run a single test you can use the following command

```
npx lab <test/to/run.js> // (ie: npx lab test/index.test.js)
```

## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[hapi]: https://hapijs.com/
[license]: ./LICENSE.md
