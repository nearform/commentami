# @nearform/comments-backend-core

## Setup

To use the `comments-backend-core` module you will need to pass a connection object to it's initialization function.

This connection object should be an instance of the `Pool`/`Client` from `node-postgres` or an object with the same interface.

## Hooks

When instantiating the `comments` service you can pass two optionsl hooks to decorate comments. Those functions should be either async or return a promise that will yeld the final augmented comment/comments list as their result:

- `fetchedComment`: `[async] (comment) => { ... }` decorates a single comment
- `fetchedComments`: `[async] (comments) => { ... }`  decorates a list of comments

## Development

### Initializing the db

To initialize the db you can run:

```
npm run pg:test:init
```

This will drop the `comments` if it exists. Re-create it and migrate it to the latest schema.

The configuration for the postgres db connection can be changed through the following ENV variables:

```
NF_COMMENTS_PGHOST
NF_COMMENTS_PGUSER
NF_COMMENTS_PGDATABASE
NF_COMMENTS_PGPASSWORD
NF_COMMENTS_PGPORT
```

For local development there should be sensible defaults in [`config/index.js`](./config/index.js).

#### postgres on docker?

If you want to run postgres on docker, install [docker](https://docs.docker.com/install/) and run the following command

```
docker-compose up postgres
```

### Run tests

Once the db is up, to run the tests use

```
npm test
```

## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[license]: ./LICENSE.md
