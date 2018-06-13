### Service

The service provides the functionality to connect the Component with the server.

With the project are provided 2 services:

* CommentsFetchService - To connect to the REST api
* CommentsNesService - To connect to the server with a websocket

*an additional `CommentsInMemoryService` is available and can be used in tests and storybook.*

```
import { CommentsNesService } from '@nearform/commentami-react-components'

const commentsNesService = CommentsNesService('ws://localhost:8080/')

render() {
  <Resource resource="res-1" service={commentsNesService}>
    ...
  </Resource>
}
```

A service should expose the following functions

#### addComment(resource: string, comment: Comment) => async Comment

Add a comment to the current resource. The Comment object should be provided with the following information:

* content: string - The content of the comment (eg. 'some content')
* reference: Reference - The reference with an identifier (eg {id: 'ref-1'})

returns the added `comment` with all the data returned by the server.

```
const newComment = await service.addCommment('res-1', {reference: {id: 'ref-1'}, content: 'some content'})

/*
newComment =>
{
  id: 'comm-1',
  content: 'some content',
  reference: 'ref-1',
  author: 'Davide Fiorello',
  createdAt: 1234566788
}
*/

```

#### removeComment(comment: Comment)

Remove a comment. The Comment object should be provided with the following information:

* id: string - The identifier of the comment that should be removed

```
await service.removeCommment{id: 'comm-1'}})
```

#### getComments(resource: string) => async Comment[]

Get the list of the comments related to a resource

```
const comments = await service.getComments('res-1')

/*
comments =>[
{
  id: 'comm-1',
  content: 'some content',
  reference: 'ref-1',
  author: 'Davide Fiorello',
  createdAt: 1234566788
},
{
  ....
}
]
*/

```

#### onResourceChange(resource: string, handler: func) => async func

Subscribe to a resource change on the server. Returns the unsubscribe callback.

```
function handler({action, comment}) {
  switch(action) {
    case: 'add':
      ...
    case: 'delete':
      ...
  }
}

const unsubscribe = await service.onResourceChange('res-1', handler)

...
// to unsubscribe
unsubscribe()
```
