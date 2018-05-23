# Comments - Server

## How to use the core `comments` module

To use the `comments` module you will need to pass a connection object to it's initialization function.

This connection object should be an instance of the `Pool`/`Client` from `node-postgres` or an object with the same interface.

## Development

### Creating an db poll/connection object

To simplify development and integration we have a `initDb` function (`db.js` module) that can be use to:

1. create a `Pool` instance from env variables (see belove)

2. create a `Pool` instance from a configuration object

You can then use this object as the connection passed to the `comments` module initialization function.

### Initializing the db

To initialize the db you can run:

```
npm run setup-dev-db
```

This will drop the `comments-db` if it exists. Re-create it and migrate it to the latest schema.

The configuration for the postgres db connection can be changed through the following ENV variables

```
NF_COMMENTS_PGHOST
NF_COMMENTS_PGUSER
NF_COMMENTS_PGDATABASE
NF_COMMENTS_PGPASSWORD
NF_COMMENTS_PGPORT
```

For local development there should be sensible defaults in [`config/index.js`](/server/src/config/index.js).

#### postgres on docker?

If you want to run postgres on docker, install [docker](https://docs.docker.com/install/) and run the following command

```
docker-compose up postgres
```

### Run test

Once the db is up, to run the tests use

```
npm test
```
