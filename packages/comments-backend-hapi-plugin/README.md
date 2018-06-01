# @nearform/comments-backend-hapi-plugin

`@nearform/comments-backend-hapi-plugin` is a plugin to add the comments REST API and (if specified) Websockets to a [Hapi][hapi] server.

## Install

To install via npm:

```
npm install @nearform/comments-backend-hapi-plugin
```

## Usage

`comments-backend-hapi-plugin` has some options you can specifiy to customize the installation


### `options.pg` [optional]

It should contain an object with the postgres connection parameters.

```
options.pg = {
  host: '127.0.0.1',
  port: 9876
}
```

Any parameter in this object will override whatever comes from `@nearform/comments-backend-core` `config.pg`.

### `options.hooks` [optional]

It should contain the hooks to decorate a single comment or a list of comments with data.

An example could be adding users data to each comments based on it's author.

```
options.hooks = {
  fetchedComment: async (comment) => {
    // ... fetch user data

    return augmentedComment
  },
  fetchedComments: async (comments) => {
    // ... fetch users data

    return augmentedComments
  }
}
```

### `options.multines` [optional]

By default the server will start with only the http endpoints available. If you also want to interact through websocket you should provide a `multines` option.

The option whould be an object with the following format

```
multines: {
  type: 'redis', // accepcts only "redis" or "mongo"

  // specific configurations for redis/mongo
  host: '127.0.0.1',
  port: 6379
}
```

An example on how to install the plugin with all the options:

```javascript
const main = async function() {
  const server = require('hapi').Server({ host: 'localhost', port: 80 })

  const options = {
    // hooks to decorate comments (ie: adding user data)
    fetchedComment: async (comment) => {
      // ...
      return augmentedComment
    },
    fetchedComments: async (comments) => {
      //...
      return augmentedComments
    },

    // override comments-core db configuration
    pg : {
      host: '127.0.0.1',
      port: 5432
    },

    // pass the configuration for multines
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


## Development

### Run tests

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
