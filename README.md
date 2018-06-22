# @nearform/commentami

[![CircleCI](https://circleci.com/gh/nearform/commentami/tree/master.svg?style=svg&circle-token=560be71ca1b0f5855e1e3462a69221bc34da3aac)](https://circleci.com/gh/nearform/commentami/tree/master)

Commentami - React Comments system (Google doc like)

| Module                                                                 | Package                                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [@nearform/commentami-backend-core][commentami-backend-core]               | [./packages/commentami-backend-core](./packages/commentami-backend-core)               |
| [@nearform/commentami-backend-hapi-plugin][commentami-backend-hapi-plugin] | [./packages/commentami-backend-hapi-plugin](./packages/commentami-backend-hapi-plugin) |
| [@nearform/commentami-react-components][commentami-react-components] | [./packages/commentami-react-components](./packages/commentami-react-components) |

## Frontend

Commentami React components requires [React][node] 16.3+.

### Build the components

To build the frontend you can run the following command

```
cd packages/commentami-react-components

npm run build
```

This will place in the `dist` folder the compiled components.

If you want to see them in action you can start the demo from `packages/commentami-demo`

```
cd packages/commentami-demo

npm run watch
```

To save comments on the server and have an example of sockets and HTTP REST apis you will need to start the server as described below.

## Backend

### Node.js support

Commentami requires [Node.js][node] 8.9.0+.

The [Hapi][hapi] plugin and server packages require Hapi 17+.

### Install

To install all the dependecies you can run

```
npm install
```

in the root of the project.

### Dependencies

Commentami requires an instance of Postgres (version 9.5+) and redis to function correctly. For simplicity, a preconfigured `docker-compose` file has been provided. To run it:

```
docker-compose up postgres redis
```

* **Note:** Ensure you are using the latest version of Docker for (Linux/OSX/Windows)
* **Note:** Commentami needs PostgreSQL >= 9.5

#### Populate the database

The initial tables can be created by executing:

```
npm run pg:init
```

This command will also migrate the tables to their most recent structure.

### Migrations

We use [`postgrator`][postgrator] for database migrations. You can find the sql files in the [`packages/commentami-backend-core/database/migrations`](https://github.com/nearform/comments/tree/master/packages/commentami-backend-core/database/migrations) folder. To run the migrations manually:

```
npm run pg:migrate // either in the root folder or in the `commentami-backend-core` folder
```

### pgAdmin database access

As the Postgresql docker container has its 5432 port forwarded on the local machine the database can be accessed with pgAdmin.

To access the database using the pgAdmin you have to fill in also the container IP beside the database names and access credentials. The container IP can be seen with `docker ps`. Use IP 127.0.0.1 and use postgres as username/password to connect to database server.

## Testing and linting

To run tests

```
run test
```

To run the linter

```
npm run lint
```

## Runnig the server on docker

**The following configuration is just for local development/demo, it is not for production environments**

If you don't want to run all services and the server on your machine, you can use docker.

To setup the images/containers you should have docker installed locally and then run:

```
docker-compose build
```

This should produce something like the following output

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

Run

```
docker ps
```

and take the name of your `app` container

```
CONTAINER ID        IMAGE               COMMAND                  CREATED                  STATUS              PORTS                    NAMES
e7e59d3c637b        commentami_app      "npm run start"          Less than a second ago   Up 10 seconds       0.0.0.0:8080->8080/tcp   commentami_app_1
a311174dcadd        postgres:10         "docker-entrypoint.s…"   Less than a second ago   Up 12 seconds       0.0.0.0:5432->5432/tcp   commentami_postgres_1
172f656dc618        redis:alpine        "docker-entrypoint.s…"   Less than a second ago   Up 11 seconds       0.0.0.0:6379->6379/tcp   commentami_redis_1
```

and then tun

```
docker exec commentami_app_1 npm run pg:init
```

### Run tests

To run the tests you can use

```
docker exec commentami_app_1 npm test
```

**Note:** the server running on docker does not reaload the code if you change it.

### Pinging the app from curl

Once you have a database running and all the tables set up, you can try to run `curl` for the list endpoint

```
curl http://localhost:8080/comments\?resource\=\test
```

the output should be something like

```
{"comments":[],"total":"0","limit":100,"offset":0}
```

## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[commentami-backend-core]: https://www.npmjs.com/package/@nearform/commentami-backend-core
[commentami-backend-hapi-plugin]: https://www.npmjs.com/package/@nearform/commentami-backend-hapi-plugin
[commentami-react-components]: https://www.npmjs.com/package/@nearform/commentami-react-components
[node]: https://nodejs.org/it/
[hapi]: https://hapijs.com/
[postgrator]: https://github.com/rickbergfalk/postgrator
[license]: ./LICENSE.md
