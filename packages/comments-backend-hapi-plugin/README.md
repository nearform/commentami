# @nearform/comments-backend-hapi-plugin

`@nearform/comments-backend-hapi-plugin` is a plugin to add the trail REST API to a [Hapi][hapi] server.

## Install

To install via npm:

```
npm install @nearform/trail-hapi-plugin
```

## Usage

```javascript
const main = async function() {
  const server = require('hapi').Server({ host: 'localhost', port: 80 })

  await server.register([
    {
      plugin: require('@nearform/comments-backend-hapi-plugin')
    }
  ])

  await server.start()
  logMessage(`Server running at: ${server.info.uri}`)
}

main().catch(console.error)
```

Trails route will be then accessible on the `/comments` path.

## License

Copyright nearForm Ltd 2018. Licensed under [MIT][license].

[hapi]: https://hapijs.com/
[license]: ./LICENSE.md
