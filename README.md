# @nearform/comments

React Comments system

| Module                                                                 | Package                                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [@nearform/comments-backend-core][comments-backend-core]               | [./packages/comments-backend-core](./packages/comments-backend-core)               |
| [@nearform/comments-backend-hapi-plugin][comments-backend-hapi-plugin] | [./packages/comments-backend-hapi-plugin](./packages/comments-backend-hapi-plugin) |
| [@nearform/comments-backend-hapi-server][comments-backend-hapi-server] | [./packages/comments-backend-hapi-server](./packages/comments-backend-hapi-server) |

### Node.js support

Comments requires [Node.js][node] 8.9.0+.

The [Hapi][hapi] plugin and server packages require Hapi 17+.

### Database support

Comments requires an instance of Postgres (version 9.5+) to function correctly. For simplicity, a preconfigured `docker-compose` file has been provided. To run:

```
cd packages/comments-backend-core
docker-compose up
```

* **Note:** Ensure you are using the latest version of Docker for (Linux/OSX/Windows)
* **Note:** Comments needs PostgreSQL >= 9.5

#### Populate the database

The initial tables can be created by executing:

```
npm run pg:init
```

### pgAdmin database access

As the Postgresql docker container has its 5432 port forwarded on the local machine the database can be accessed with pgAdmin.

To access the database using the pgAdmin you have to fill in also the container IP beside the database names and access credentials. The container IP can be seen with `docker ps`. Use IP 127.0.0.1 and use postgres as username/password to connect to database server.

### Migrations

We use [`postgrator`][postgrator] for database migrations. You can find the sql files in the [`packages/comments-backend-core/database/migrations`](https://github.com/nearform/comments/tree/master/packages/comments-backend-core/database/migrations) folder. To run the migrations manually:

```
node packages/comments-backend-core/database/migrate.js <version>`
```

**Note:** Running the tests or init commands will automaticaly bring the db to the latest version.

## Testing

To run tests:

```
lerna run test
```

```
npm run lint
```

## Runnig the server on docker

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

To run the backend app you can now use the following command

```
docker-compose up
```

### Initializing the db

you can run

```
docker exec comments_app_1 npm run pg:init
```

### Run tests

to run the tests use

```
docker exec comments_app_1 npm test
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

## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[comments-backend-core]: https://www.npmjs.com/package/@nearform/comments-backend-core
[comments-backend-hapi-plugin]: https://www.npmjs.com/package/@nearform/comments-backend-hapi-plugin
[comments-backend-hapi-server]: https://www.npmjs.com/package/@nearform/comments-backend-hapi-server
[node]: https://nodejs.org/it/
[hapi]: https://hapijs.com/
[postgrator]: https://github.com/rickbergfalk/postgrator
[license]: ./LICENSE.md
