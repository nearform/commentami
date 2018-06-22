# @nearform/commentami-backend-core

`@nearform/commentami-backend-core` is the low level library used by `@nearform/commentami-backend-hapi-plugin`. This library manages the CRUD actions for comments.

## Install

To install via npm:

```
npm install @nearform/commentami-backend-core
```

## Model

In `@nearform/commentami-backend-core` a comment is an obejct with the following properties

```
Comment {
  id, // int
  resource, // long string
  reference, // string
  content, // text
  author, // optional, Object {username: string}
  mentions, // array of identifiers found in the comment content (@<identifier>) returned by default with the format [{username: string}]
  createdAt // date
}
```

The main idea is that a comment belongs to a `resource` (ie: a web page) and to a `reference` (ie: paragraph, subsection of the page).

The `resource` and the `reference` are loosly defined to accomodate different interpretations, but a comment needs both to be specified.

Last but not least, the `mentions` property is a list of mentions (`@<identifier>`) found in the comment content when it is added or updated.

## Usage

To access the CRUD functions you need to initialize the module with an object that has the same interface of a `Pool` from [`node-postgres`](https://github.com/brianc/node-postgres).

```javascript
const { config, buildPool, buildCommentsService } = require('@nearform/commentami-backend-core')

const commentService = buildCommentsService(buildPool(config.pg))
```

To configure the postgres connection parameters you can user the following env variables

```
NF_COMMENTS_PGHOST
NF_COMMENTS_PGUSER
NF_COMMENTS_PGDATABASE
NF_COMMENTS_PGPASSWORD
NF_COMMENTS_PGPORT
```

or if you already have a pool object or anything else that exposes the same interface, you can pass it directly

```javascript
const { buildCommentsService } = require('@nearform/commentami-backend-core')
const myDbClient = //...

const commentService = buildCommentsService(myDbClient)
```

`commentService` exposes the following functions

```javascript
commentService.add
commentService.get
commentService.update
commentService.delete
commentService.list
commentService.listOnlyReferences
commentService.getInvolvedUsers
```

and provide events for when a comment is added, updated or deleted.

To add a listener to any of this events follow this example:

```javascript
// build your commentService object

const { buildCommentsService } = require('@nearform/commentami-backend-core')
const myDbClient = //...

const commentService = buildCommentsService(myDbClient)

// add listeners

commentService.on('add', (comment) => { // do something })
commentService.on('update', (comment) => { // do something })
commentService.on('delete', (comment) => { // do something })
```

## `commentService` interface

### `commentService.list`

The `list` function accepts the following parameters:

- `resource`: it is mandatory and if not provided will result in a response with an empty list of comments.
- `reference`: this parameter can be `null` or omitted.
- `options`: this parameter can be omitted, if not, it can contain `limit` (defaults to 100) and `offset` (defaults to 0).

The `list` will filter the comments based on `resource` and `reference` (if provided) and implements a pagination system based on the `limit` and `offset` parameters.

```javascript
async function myFn () => {
  // ...
  const list = await commentsService.list(resource, reference, { limit: 50, offset: 15 })

  // list object
  //
  // {
  //   comments: [ ... ],
  //   total: 10,
  //   limit: 50, <== defaults to 100
  //   offset: 15 <== defaults to 0
  // }
}
```

### `commentService.listOnlyReferences`

The `listOnlyReferences` function accepts only one parameter: a `resource`.

This function will return the list of `reference`s (strings) for the specified `resource`.

```javascript
async function myFn () => {
  // ...
  const list = await commentsService.listOnlyReferences(resource)

  // list object
  //
  // {
  //   resource: '...',
  //   references: ['ref1', 'ref2', ...]
  // }
}
```

### `commentService.add`

```javascript
async function myFn () => {
  // ...
  const comment = {
    resource: 'some-resource',
    reference: 'some-reference',
    content: 'some content, notify @test!',
    author: 'author' // optional
  }
  const created = await commentsService.add(comment)

  // ...
}
```

### `commentService.get`

```javascript
async function myFn () => {
  // ...
  const comment = await commentsService.get(id)
  // ...
}
```

### `commentService.update`

The only field that will be updated is the `content`, no other field can be modiefied.

```javascript
async function myFn () => {
  // ...
  const comment = await commentsService.update(id, {
    content: 'some new content'
  })
  // ...
}
```

### `commentService.delete`

When deleting a comment, the result will be either `null` (id not valid, comment not found) or the deleted comment object

```javascript
async function myFn () => {
  // ...
  const deletedComment = await commentsService.delete(id)
  // ...
}
```

### `commentService.getInvolvedUsers`

To have a list of usernamens that have written a comment on the same resource/reference

```javascript
const involvedUsers = await commentsService.getInvolvedUsers(comment)
```

## Hooks

When the application fetches one or more comments or involved users, you can hook into the process to add domain specific data to them.

To do so, you can specify 3 optional functions when initializing the `commentService`.

```javascript
const commentService = buildCommentsService(dbConn, {
  fetchedComment: [async] (comment) => {
    // add your data to the comment ...

    return comment // or a promise that will yield the enached comment
  },
  fetchedComments: [async] (commentsList) => {
    // add your data to the commentsList ...

    return commentsList // or a promise that will yield the enached commentsList
  },
  involvedUsers: [async] users => {
    // add your data to the involved users ...
    return users // or a promise that will yield the enached involved users
  }
})
```

## Development

### Initializing the db

To initialize the db you can run:

```
npm run pg:test:init
```

This will drop the `comments_test` database if it exists. Re-create it and migrate it to the latest schema.

For local development there should be sensible defaults in [`config/index.js`](./config/index.js).

#### Postgres on Docker?

If you want to run postgres on docker, install [docker](https://docs.docker.com/install/) and run the following command

```
docker-compose up postgres
```

### Run tests

Once the db is up and initialized, run

```
npm test
```

To run a single test you can use the following command

```
npx lab <test/to/run.js> // (ie: npx lab test/lib/comments.test.js)
```

## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[license]: ./LICENSE.md
