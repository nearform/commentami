# Server/Client authentication and user data example

This example will show you how to configure the `commentami` hapi plugin so that you have

- `commentami` routes protected by your authentication strategy
- comments with users data

## Add authentication

First of all we need to setup an authentication method. As an example we will use basic auth with [`hapi-auth-basic`](https://www.npmjs.com/package/hapi-auth-basic).

In the file where you initialize the server you should have something like:

```
const Basic = require('hapi-auth-basic')
const { validate } = require('./auth')

const server = require('hapi').Server({ /*your server config*/ })

await server.register([Basic])
server.auth.strategy('simple', 'basic', { validate })

await server.register([{
  plugin: require('@nearform/commentami-backend-hapi-plugin'),
  options: {
    multines: { /* optional, config for pub/sub using redis or mongo */ },
    nes: {
      auth: {
        route: 'simple'
      }
    },
    auth: true,
    routes: {
      cors: true,
      auth: 'simple',
      getUser: async (request, payload) => {
        let user = request.auth.credentials

        return user
      }
    }
  }
}])

...
```

This will initialize your server with an authentication strategy (`simple`) and scheme (`basic`), and tell `@nearform/commentami-backend-hapi-plugin` to use that strategy for its own routes. Moreover, we added the `getUser` function to let the plugin know how to retrieve a user when a request comes in. This way, when adding a comment, the `author` field of a comment will be populated with whatever is the value of `user.id`.

For the strategy to work we need to define the `validate` function. For the purpose of this example we will create a `auth.js` file that will contain all functions relative to users management.

```
// auth.js

// THIS IS NOT FOR A PRODUCTION ENVIRONMENT

const find = require('lodash/find')

const passwords = {
  test: 'test'
}

const users = {
  test: {
    id: 1,
    username: 'test',
    firstName: 'test',
    lastName: 'test',
    avatarUrl: 'https://api.adorable.io/avatars/285/test@commentami.com.png',
    profileUrl: 'https://www.google.com'
  }
}

function fetchUserById(id) {
  return find(users, { id })
}

const validate = async (request, username, password) => {
  if (!users[username] || !passwords[username]) {
    return { isValid: false }
  }

  if (password !== passwords[username]) {
    return { isValid: false }
  }

  return { isValid: true, credentials: users[username] }
}

module.exports = {
  validate,
  fetchUserById
}
```

The `validate` function will check the username and password against our "database" and if the check is successful, it will return an object with `isValid: true` and the `credentials` property.

**Note**: the `credentials` value it's the same we find in `request.auth.credentials`.

## Check authentication with http/websocket client

Once the `auth.js` is up and the plugin is wired to the `simple` strategy, we need to test that a client can connect to the `commentami` http routes or websockets.

Start the server and then try to run the following scripts

```
// Http client

const request = require('superagent')
const authHeader = `Basic ${Buffer.from('test:test').toString('base64')}`

request
  .post('http://<your-server>/comments')
  .set('Authorization', authHeader)
  .send({
    resource: 'URL',
    reference: 'UUID',
    content: 'MESSAGE'
  })
  .end((err, res) => {
    console.log(res.body)
  })

// should print something like:
//
// {
//   id: ...,
//   resource: 'URL',
//   reference: 'UUID',
//   content: 'MESSAGE',
//   createdAt: ...,
//   author: 1
// }
```

```
// Websocket

const Nes = require('nes')
const authHeader = `Basic ${Buffer.from('test:test').toString('base64')}`
const client = new Nes.Client('ws://<your-server>')

const run = async () => {
  await client.connect({ auth: { headers: { authorization: authHeader } } })

  const response = await client.request({
    method: 'POST',
    path: '/comments',
    payload: {
      resource: 'URL',
      reference: 'UUID',
      content: 'MESSAGE'
    }
  })

  console.log(response.payload)
}

run()
  .then(() => client.disconnect())
  .catch(err => {
    console.log(err)
    process.exit(1)
  })

// should print something like:
//
// {
//   id: ...,
//   resource: 'URL',
//   reference: 'UUID',
//   content: 'MESSAGE',
//   createdAt: ...,
//   author: 1
// }
```

If you want to be sure the authentication is working properly, try to remove the `authHeader` from the calls and you should get a `401 Not authorized` with the http apis, and a `Socket error` with the websocket.

## Add user data to comments

Now that we have the authentication in place, we should be able to add users data to comments based on their `author` field.

To do so we can add the `hooks` property to the plugin configuration:

```
const commentsHooks = require('./comments-hooks')

[...]

await server.register([{
  plugin: require('@nearform/commentami-backend-hapi-plugin'),
  options: {
    [...],
    hooks: commentsHooks
  }
}])
```

The `comments-hooks.js` file will export an object with two properties: `fetchedComment` and `fetchedComments`. These are the functions the plugin will use to decorate one single comment or a list of comments with data you will provide.

The following is our example `comments-hooks.js` content

```
// THIS IS NOT FOR A PRODUCTION ENVIRONMENT

const { fetchUserById } = require('./auth')

function addUser(comment) {
  const user = fetchUserById(parseInt(comment.author))

  if (user) {
    comment.author = user
  }

  return comment
}

async function fetchedComment(comment) {
  return addUser(comment)
}

async function fetchedComments(comments) {
  return comments.map(comment => addUser(comment))
}

module.exports = {
  fetchedComment,
  fetchedComments
}
```

In a few words: we are looking for a user based on the `comment.author` field (`fetchUserById(parseInt(comment.author))`) and if found, we replace the comment `author` field with the user data.

If we now run again the two client scripts, we should get something like this in the console

```
{
  id: ...,
  resource: 'URL',
  reference: 'UUID',
  content: 'MESSAGE',
  createdAt: '2018-06-14T14:24:34.244Z',
  author: {
    id: 4,
    username: 'test',
    firstName: 'test',
    lastName: 'test',
    avatarUrl: 'https://api.adorable.io/avatars/285/test@commentami.com.png',
    profileUrl: 'https://www.google.com'
  }
}
```

This's it! You now have all `commentami` endpoints decorating comments with their users data.

If you want to have a look at a working example, you can head to the [`commentami-demo-server` package](https://github.com/nearform/commentami/tree/master/packages/commentami-demo-server) and check out the configuration there.
