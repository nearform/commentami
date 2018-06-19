# @nearform/commentami-backend-hapi-plugin

`@nearform/commentami-backend-hapi-plugin` is a plugin to add the commentami REST API and (if specified) Websockets to a [Hapi][hapi] server.

## Install

To install via npm:

```
npm install @nearform/commentami-backend-hapi-plugin
```

## Usage

`@nearform/commentami-backend-hapi-plugin` has some options you can specifiy to customize it

### `options.pg` \[optional\]

It should contain an object with the postgres connection parameters.

```
options.pg = {
  host: '127.0.0.1',
  port: 9876
}
```

Any parameter in this object will override whatever comes from `@nearform/commentami-backend-core` [`config.pg`](https://github.com/nearform/commentami/blob/master/packages/commentami-backend-core/config/index.js).

### `options.routes` \[optional\]

Through the `routes` option you can configure `@nearform/commentami-backend-hapi-plugin` to have it's routes protected behind an authentication strategy and add the `cors` handling by Hapi:

```
options.routes = {
  cors: true,
  auth: 'myauth'
}
```

If you want `@nearform/commentami-backend-hapi-plugin` to populate the `author` field when adding a comment, you can provide the following function:

```
options.routes = {
  auth: 'myauth',
  getUser: async (request, payload) => {
    // ...
    return user
  }
}
```

The `getUser` function will need to return a promise that will yield either `null` or an object with the property `id` (ie : `{ id: 1, ... }`). Beware that **`author` will be stored as a string**.

### `options.hooks` \[optional\]

It should contain the hooks to decorate a single comment or a list of comments with more data.

An example could be adding users data to each comment based on its author, or add users data based on mentions.

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

### `options.multines` \[optional\]

By default the server will start with only the http endpoints available. If you also want to interact through websocket you should provide a `multines` option.

The option should be an object with the following format

```
multines: {
  type: 'redis', // only "redis" or "mongo"

  // specific configurations for redis/mongo
  host: '127.0.0.1',
  port: 6379
}
```

**Note**: if you pass `options.multines = {}` the websockets will be active but the pub/sub system will work only for the single server and not between multiple servers (ie: through redis pub/sub).

### `options.nes` \[optional\]

If you want to customize the `nes` plugin you can pass [its options](https://github.com/hapijs/nes/blob/master/lib/index.js#L17-L42) through `options.nes`.

An example of what you may want to do is settig up nes to use an authentication strategy that you have already added to you server

```
nes: {
  auth: {
    type: 'token',
    route: 'myauth'
  }
}
```

### `options.resolvers`
It should contain resolvers that retrieve data not related to the `commentami` environment and are required to provide useful information
```
options.hooks = {
  resolveUrl: async (comment) => {
    // ... given the comment resolve the page that contains the specific resource

    return baseUrl
  }
}
```

## Events

Under the hood `@nearform/commentami-backend-hapi-plugin` add a `commentsService` object to both `server` and `request`.

If you need to be notified when a comment is added, deleted or updated you can use this object to add your listeners.

```
server.commentsService.on('add', (comment) => { /*...*/ })
server.commentsService.on('update', (comment) => { /*...*/ })
server.commentsService.on('delete', (comment) => { /*...*/ })
```

## All together

An example on how to install the plugin with all the options and events listeners:

```javascript
const main = async function() {
  const server = require('hapi').Server({ host: 'localhost', port: 80 })

  const options = {
    hooks: {
      fetchedComment: async comment => {
        // ...
        return augmentedComment
      },
      fetchedComments: async comments => {
        //...
        return augmentedComments
      }
    },
    pg: {
      host: '127.0.0.1',
      port: 5432
    },
    multines: {
      type: 'redis',
      host: '127.0.0.1',
      port: 6379
    },
    nes: {
      auth: {
        type: 'token',
        route: 'myauth'
      }
    },
    routes: {
      auth: 'myauth',
      getUser: async (request, payload) => {
        // ...
        return user
      }
    }
  }

  await server.register([
    {
      plugin: require('@nearform/commentami-backend-hapi-plugin', options)
    }
  ])

  server.commentsService.on('add', comment => {
    /* send sms */
  })
  server.commentsService.on('add', comment => {
    /* send email */
  })
  server.commentsService.on('delete', comment => {
    /* store deleted comments somewhere else */
  })
  server.commentsService.on('update', comment => {
    /* log the updated comment somewhere */
  })

  await server.start()
  logMessage(`Server running at: ${server.info.uri}`)
}

main().catch(console.error)
```

## HTTP APIs

The plugin mounts the following endpoints

### `GET /comments-references/{resource*}`

This endpoint will return the list of `reference`s linked to a `resource`.

```
GET /comments-references/some-resource

{
  resource: `some-resource`,
  references: [ 'ref1', 'ref2', ... ]
}
```

### `GET /comments?resource={resource}[&reference={reference}][&limit={limit}][&offset={offset}]`

This endpoint will return a paginated list of comments relative to a `resource` (this parameter is required) and a `reference` (when specified)

```
GET /comments?resource=some-resource

{
  comments: [ ... ],
  total: 10,
  limit: 100
  offset: 0
}
```

The list is paginated based on `limit` (default 100) and `offset` (default 0) parameters.

### `GET /comments{id}`

This endpoint will return a single comment

```
GET /comments/1234

{
  id: 1234,
  resource: 'some-resource',
  reference: 'some-reference',
  content: 'some content',
  author: 'author',
  createdAt: 2018-05-31T08:01:25.296Z
}
```

The list is paginated based on `limit` (default 100) and `offset` (default 0) parameters.

### `POST /comments`

This endpoint will create a new comment.

The body of the request is as follow and all parameters but author are required

```
POST /comments

{
  resource: 'some-resource',
  reference: 'some-reference',
  content: 'some content',
  author: 'author'
}
```

### `PUT /comments/{id}`

This endpoint will update the content of a comment

```
POST /comments/{id}

{
  content: 'some new content'
}
```

### `DELETE /comments/{id}`

This endpoint will delete a comment

```
POST /comments/{id}
```

## Websockets

If you enabled `multines` on the server (see [options](#Usage)) you will be able to use a [`nes`](https://github.com/hapijs/nes) client to communicate with it through websocket.

A `nes` client will map all the server HTTP API enpoints

```
client = new Nes.Client('ws://<my-server>')
await client.connect()
const response = await client.request(`/comments-references/${this.resource}`) // list comments

// or

const response = await client.request({ // create a new comment
  method: 'POST',
  path: `/comments`,
  payload: {
    resource: 'URL',
    reference: 'UUID',
    content: 'MESSAGE',
    author: 'AUTHOR'
  }
})
```

### Subscriptions
#### resource  and reference
When a resource or a reference is `added`/`updated`/`deleted` an event is sent to the users that are connected.

```
client = new Nes.Client('ws://127.0.0.1:8281')
await client.connect()

await client.subscribe(`/resources/some-resource`, (event) => {
  // do something
})

await client.subscribe(`/resources-reference/some-reference/some-resource`, (event) => {
  // do something
})
```

The `event` object will have the following format

```
{
  comment: {
    id: 1234,
    resource: 'URL',
    reference: 'UUID',
    content: 'MESSAGE',
    author: 'AUTHOR',
    createdAt: 2018-05-31T08:01:25.296Z
  },
  action: 'add'
}
```

The `action` property can have one of the following values: `add`, `delete` or `update`.

#### users
When a comment is added to a reference alle the users `involve` in the reference will be informed.
An involved user is a user that has previously added a comment to the reference.

A notify is sent to the user also if it's `mention` in the comment.
Within the event an URL containing a deeplink to the comment is sent.

```
client = new Nes.Client('ws://127.0.0.1:8281')
await client.connect()

await client.subscribe(`/users/some-user-id`, (event) => {
  // do something
})
```

The `event` object will have the following format

```
{
  comment: {
    id: 1234,
    resource: 'RESOURCE-ID',
    reference: 'UUID',
    content: 'MESSAGE',
    author: 'AUTHOR',
    createdAt: 2018-05-31T08:01:25.296Z
  },
  action: 'mention',
  url: 'http://someurl.com/the-path-to-the-resource?resource=RESOURCE-ID&reference=UUID&comment=1234'
}
```

The `action` property can have one of the following values: `mention`, `involve`.



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
