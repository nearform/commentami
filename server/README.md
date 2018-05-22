# Comments - Server

## Initializing the db

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

### postgres on docker?

If you want to run postgres on docker, install [docker](https://docs.docker.com/install/) and run the following command

```
docker-compose up postgres
```

## Run test

Once the db is up, to run the tests use

```
npm test
```
