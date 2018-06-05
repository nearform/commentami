# Comments - open source commenting system

Comments is a commenting system designed to add "comments like in Google Docs" to frontends supporting [Reactjs](https://reactjs.org).

Comments backend can be used as a standalone node.js module ([comments-backend-core](https://github.com/nearform/comments/tree/master/packages/comments-backend-core)), as a Hapi plugin that provides a REST API and websockets ([comments-backend-hapi-plugin](https://github.com/nearform/comments/tree/master/packages/comments-backend-hapi-plugin)),  and as a stand alone server ([comments-backend-server](https://github.com/nearform/comments/tree/master/packages/comments-backend-hapi-server)).

Comments frontend components ...

## Background

Collaboration in modern applications is a killer feature, a generic commenting system will allow you to deliver better solutions faster.

...

## CORE CONCEPTS

In Comments a comment is an obejct with the following property

```
Comment {
  id, // numeric
  resource, // long string
  reference, // string
  content, // text
  author, // optional value, string
  createdAt // datetime
}
```

The main idea is that a comment belongs to a `resource` (ie: a web page) and to a `reference` (ie: a paragraph or subsection of the page).

The `resource` and the `reference` are loosly defined to accomodate different interpretations, but a comment needs both to exists.

## REST API

|Path|Method|Summary|
|----|------|-------|
|`/comments-references/{resource*}`|GET|List all referencence belog a resource|
|`/comments?resource=...[&reference=...][&limit=...][&offset=...]`|GET|Paginated list of comments. Query parameters: `resource`, `reference`, `limit`, `offset`. **Note:** the `resource` query parameter is mandatory|
|`/comments`|POST|Create a new comment|
|`/comments/{id}`|PUT|Update a comment `content` field|
|`/comments/{id}`|DELETE|Delete a comment|
|`/comments/{id}`|GET|Get single comment|


## WEBSOCKETS

Comments ocmes with a ready made socket server that you can intercat with using [`nes`](https://github.com/hapijs/nes).
Other then mapping all REST API endpoints, connecting through a socket will allow your client to subscribe to events such as addition, update and deletion of comments, based on `resource` and optionally `reference`.

## NEXT STEPS

...
