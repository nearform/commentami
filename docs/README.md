# Comments - open source commenting system

Comments is a commenting system designed to add comments like the ones you can add in Google Docs.

The fronted is based on [Reactjs >= 16](https://reactjs.org).

Comments backend can be used as a standalone node.js module ([commentami-backend-core](https://github.com/nearform/comments/tree/master/packages/commentami-backend-core)), as a Hapi plugin that provides a REST API and websockets ([commentami-backend-hapi-plugin](https://github.com/nearform/comments/tree/master/packages/commentami-backend-hapi-plugin)), and as a stand alone server ([commentami-backend-hapi-server](https://github.com/nearform/comments/tree/master/packages/commentami-backend-hapi-server)).

Comments frontend components are built to have logic and presentation separetated. This should give as much freedom as possible in integrating these components in your UI.

## Background

Collaboration in modern applications is a killer feature. Commenting a webpage "in context" can help gather better and more specific feedback, add ideas and expand contents already present on the page.

## CORE CONCEPTS

In Comments a comment is an obejct with the following properties

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

The main idea is that a comment belongs to a `resource` (ie: a web page) and to a `reference` (ie: a paragraph or page section).

The `resource` and the `reference` are loosly defined to accomodate different interpretations, but a comment needs both to exists.

The provided react components are used to interact with the Comments server (list, add and delete comments). They also provide a way to mark elements on the page as commentable and deal with the wiring of commentable elements and their comments.

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

## REACT COMPONENTS

The interface of each web application is different. To accomodate that, we structured our components in `core` and `ui` components. This distiction should be read as

- `core`: dealing with the logic behind the fornted and the interaction with the backend
- `ui`: components that can be replaced to accomodate each web application UI


## NEXT STEPS

To get up and running with Comments, see the installation steps in the [README](https://github.com/nearform/comments).
