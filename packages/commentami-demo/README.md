# @nearform/commentami-demo

A demo app showing the usage of the [@nearform/commentami-backend-\*][commentami] packages on both client and server.

## Quick start

Before running the app you need to build the components:

```
cd packages/commentami-react-components
npm run build
```

Then, you can see the demo of the comments componentes running:

```
npm install
npm run watch
```

and opening the browser at [http://localhost:4200/](http://localhost:4200/)

if you want to interact also with the server you should go to the root of this project and run

```
docker-compose up
```

once the server is up you can run

```
docker exec commentami_app_1 npm run pg:init
```

## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[commentami]: https://github.com/nearform/commentami/tree/master/packages
[license]: ./LICENSE.md
