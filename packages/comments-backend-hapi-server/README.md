# @nearform/comments-backend-hapi-server

comments-backend-hapi-server is a ready to use [Hapi][hapi] server with the comments-backend-hapi-plugin registered.

## Install

To install via npm:

```
npm install @nearform/comments-backend-hapi-server
```

## Usage

```
npx run comments-backend-hapi-server
```

This will start a server on `localhost:8080`.

## Run tests

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
