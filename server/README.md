# Comments - Server

## How to use the core `comments` module

To use the `comments` module you will need to pass a connection object to it's initialization function.

This connection object should be an instance of the `Pool`/`Client` from `node-postgres` or an object with the same interface.

## Development

If you don't want to run things locally you can use docker.

To setup the images/containers you should have docker installed locally and then run:

```
docker-compose build
```

This should produce something as the following output

```
# docker-compose build

postgres uses an image, skipping
Building app
Step 1/4 : FROM node:8.11.2-alpine
 ---> 348d500a6d80
Step 2/4 : WORKDIR /usr/app
 ---> Using cache
 ---> 52dc46987fdb
Step 3/4 : COPY . .
 ---> 4014adb5d79e
Step 4/4 : RUN npm install --quiet
 ---> Running in 889e76abe927
up to date in 2.931s
Removing intermediate container 889e76abe927
 ---> ca0ed1c45dae
Successfully built ca0ed1c45dae
Successfully tagged server_app:latest

```

### Initializing the db (local)

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

#### Initializing the db (docker)

If you want to run postgres on docker, install [docker](https://docs.docker.com/install/) and run the following command

```
docker-compose up postgres
```

then you can run

```
docker exec server_app_1 npm run setup-dev-db
```

### Run test (local)

Once the db is up, to run the tests use

```
npm test
```

### Run test (docker)

Once the db is up, to run the tests use

```
docker exec server_app_1 npm test
```

### Pinging the app from curl

Once you have a database running and all the tables set up, you can try to run `curl` for the list endpoint

```
curl http://localhost:8080/comments\?reference\=\test
```

the output should be something like

```
{"comments":[],"total":"0","limit":100,"offset":0}
```
