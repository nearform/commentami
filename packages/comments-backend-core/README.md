# @nearform/comments-backend-core

Comments is a comments management system. [...tbd...]

`@nearform/comments-backend-core` is the low level library used by `@nearform/comments-backend-hapi-plugin`. This library manages the CRUD actions for comments.

## Install

To install via npm:

```
npm install @nearform/comments-backend-core
```

## Model

In `@nearform/comments-backend-core` a comment is an obejct with the following property

```
Comment {
  id,
  resource,
  reference,
  content,
  author,
  createdAt
}
```

The main idea is that a comment belongs to a `resource` (ie: a web page) and to a `reference` (ie: paragraph, subsection of the page).

The `resource` and the `reference` are loosly defined to accomodate different interpretations, but a comment needs both to be specified.

## Usage

To access the CRUD functions you need to initialize the module with an object that has the same interface of a `Pool`/`Client` from [`node-postgres`](https://github.com/brianc/node-postgres).

```
const { config, buildPool, buildCommentsService } = require('@nearform/comments-backend-core')

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

```
const { buildCommentsService } = require('@nearform/comments-backend-core')
const myDbClient = //...

const commentService = buildCommentsService(myDbClient)
```

The `commentService` exposes the following functions

```
commentService.add
commentService.get
commentService.update
commentService.delete
commentService.list
commentService.listOnlyReferences
```

## `commentService` interface

### `commentService.list`

The `list` function accepts the following parameters:

- `resource`: if is mandatory and if not provided will result in a response with an empty list of comments.
- `reference`: this parameter cna be `null` or omitted.
- `options`: this parameter can be omitted, if not it can contain `limit` (defaults to 100) and `offset` (defaults to 0).

The `list` will filter the comments based on `resource` and `reference` (if provided) and implements a pagination system based on the `limit` and `offset` parameters.

```
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

```
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

```
async function myFn () => {
  // ...
  const comment = {
    resource: 'some-resource',
    reference: 'some-reference',
    content: 'some content',
    author: 'author'
  }
  const created = await commentsService.add(comment)

  // ...
}

```

### `commentService.get`

```
async function myFn () => {
  // ...
  const comment = await commentsService.get(id)
  // ...
}

```

### `commentService.update`

The only field that will be updated is the `content`, no other field can be modiefied.

```
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

```
async function myFn () => {
  // ...
  const deletedComment = await commentsService.delete(id)
  // ...
}

```

## Hooks

When fetching a single comment (`commentService.get`) or a list of comments (`commentService.list`) we may want to add some other information to each of them (ie: user details).

To do so, you can specify 2 optional functions when initializing the `commentService`.

```
const commentService = buildCommentsService(dbConn, {
  fetchedComment: [async] (comment) => {
    // add your data to the comment ...

    return comment // or a promise that will yield the enached comment
  },
  fetchedComments: [async] (commentsList) => {
    // add your data to the commentsList ...

    return commentsList // or a promise that will yield the enached commentsList
  }
})
```

## Development

### Initializing the db

To initialize the db you can run:

```
npm run pg:test:init
```

This will drop the `comments` databse if it exists. Re-create it and migrate it to the latest schema.

For local development there should be sensible defaults in [`config/index.js`](./config/index.js).

#### Postgres and Redis on Docker?

If you want to run postgres/redis on docker, install [docker](https://docs.docker.com/install/) and run the following command

```
docker-compose up postgres redis
```

### Run tests

Once the db is up, you need to initialize the database

```
npm run pg:test:init
```

and the run

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
