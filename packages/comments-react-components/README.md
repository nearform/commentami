# @nearform/comments-react-components

comments-react-components is a ready to use set of React components to add commenting functionality on existing React applications.

It uses the [@nearform/comments-backend-\*][comments] packages as backend.

## Quick start

To explore components, use storybook:

```
npm install
npm run storybook
```

and then open the browser at: [http://localhost:6006/](http://localhost:6006/)

## First implemetation (POC)

The POC is just an architectural design attemp made to have a starting discussion point.
The Components created use the new React Context API (> 16).

### Components

* `<CommentableProvider/>`: To make an area commentable it should be wrapped around a `<CommentableProvider>` component. This component manage the state.
* `<CommentableBlock/>`: Every commentable part should be wrapped around a `<CommentableBlock>` component. This is currently the smallest part commentable, all the comments related to his children will be connected to the parent element.

#### A page sample

```
<CommentableProvider
  resource="main"
  service={buildService()} // This is a service you must provide
  eventsManagerComponent={EventsManager} // This prop is optional and must be a descendant of CommentsEventManager
>
    <div style={{ marginLeft: '30px' }}>
      <CommentableBlock referenceId="comm-1">
        <h1>Text Title 1</h1>
      </CommentableBlock>
      <CommentableBlock referenceId="comm-2">
        <p>Paragraphs are separated by a blank line.</p>
      </CommentableBlock>
    </div>
</CommentableProvider>
```

## CommentableProvider
The provider is the `commentable` root component.
It define an area as commentable and provides the functionality required to the children.
Using a context (`CommentableContext`) exposes the local state and the funcionality required to interact with the comment system.

#### addComment(reference: Reference, content: string)
Add a comment to the current reference

```
class CommentNewElement extends React.Component {
  handleAddComment(content) {
    this.props.commentable.addComment(this.props.reference, content)
  }
}

export const CommentNew = commentableHOC(CommentNewElement)
```

#### removeComment(comment: Comment)
Removes a comment

```
class CommentDetailsElement extends React.Component {
  handleRemoveComment() {
    this.props.commentable.removeComment(this.props.comment)
  }
}

export const CommentDetails = commentableHOC(CommentDetailsElement)
```

## The Comments State
Every `provider` manage his own state using the `CommentState`.
The CommentState is initialized at the component mounting and a new one is created when the `resource` reference in the provider changes.

`new CommentsState(options: CommentsStateOptions): CommentsState`

***This operation is note required, is done by the current CommentableProvider***


#### CommentsStateOptions
* resource: string - The resource related to the state
* service: Service - An istantiated service that allow the connection with the backend
* getProviderState: func - A function that returns the current provider state
* onCommentsStateUpdate: func - A function that update the current provider state
* logger: Logger - The logger, if is not passed the `console` is used

***note:***
The CommentState doesn't store locally the state but uses the provider state, this is why the getProvidedState and the onCommentsStateUpdate are required.
The state is stored in the field 'commentsState'

The provider state example
```
{
  // State strictly related to the provider
  toggledReference: 'res-1',
  lastResourceRefreshed: 'ref-1',
  addComment: () => {},

  ...

  // The state managed by the CommentsState
  commentsState: {
    id: 'res-1',
    references: {
      'ref-1': {
        id: 'ref-1',
        comments: {
          'comm-1': {
            id: 'comm-1',
            content: 'this is a comment',
            ...
          }
        }
      }
    }
  }
}

```

### The state structure
Define the structures present in the state:

#### Resource (Root object)
* id: string - The resource identifier
* references: <string, Reference> - An object containing all the references with at least a comment in the current `resource`

#### Reference
* id: string - The reference identifier
* comments: <string, Comment> - An object containing all the comments connected to the `reference`

#### Comment
* id: string - The Comment identifier
* reference: Reference - The reference that contains the comment
* content: string - The text of the comment
* author: string - The author of the comment, this will became a more complex structure in the future implementation
* createdAt: Timestamp - The timestamp of the comment

***Structure example***
```
{
  id: 'res-1',
  references: {
    'ref-1': {
      id: 'ref-1',
      comments: {
        'comm-1': {
          id: 'comm-1',
          content: 'this is a comment',
          reference: 'ref-1',
          author: 'Davide Fiorello',
          createdAt: 12312312312321
        },
        'comm-2': {
          id: 'comm-2',
          content: 'this is a second comment',
          reference: 'ref-1',
          author: 'Davide Fiorello',
          createdAt: 12319312312321
        }
      }
    },
    'ref-2': {
      id: 'ref-2',
      comments: {
        'comm-10': {
          id: 'comm-10',
          content: 'this is another comment',
          ...
        }
      }
    }
  }
}
```

### Selectors
The comments state is accessed using the selectors provided.
the `state` required by the selector is available in every component as a props `commentable`

#### referencesCount(state) => Number
The number of references presents in the current resource

#### commentsCount(state, reference) => Number
The number of comments related to a specific reference

#### selectCommentsByReference(state, reference) => Comments[]
The comment list related to a specific reference


***Selector example***

```
import {selectCommentsByReference} from '@nearform/comments-react-components'

const CustomComponent = (props) => {
  const comments = selectCommentsByReference(props.commentable, 'ref-1')
  return comments.map(comment => <SomeCommentDetailComponent comment={comment} />)
}

// TODO Add here the HOC export

```

### Services
The service provides the functionality to connect the Component with the server.

With the project are provided 2 services:
* CommentsFetchService - To connect to the REST api
* CommentsNesService - To connect to the socket service

a `CommentsInMemoryService` is available for test purpose.

#### addComment(resource: string, comment: Comment) => async Comment
Add a comment to the current resource.
the Comment object should be provided with the following information:
* content: string - The content of the comment (eg. 'some content')
* reference: Reference - The reference with an identifier (eg {id: 'ref-1'})

returns the added `comment with all the data added by the server.

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
Remove a comment
the Comment object should be provided with the following information:
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
Subscribe to a resource change on the server

returns the unsubscribe callback

```
function handler({action, comments}) {
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



## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[comments]: https://github.com/nearform/comments/tree/master/packages
[license]: ./LICENSE.md
