# @nearform/comments-react-components

comments-react-components is a ready to use set of React components to add commenting functionality on existing React applications.

It uses the [@nearform/comments-backend-\*][comments] packages as backend.

The POC is just an architectural design attemp made to have a starting discussion point.
The Components created use the new React Context API (> 16).

## Quick start

To explore components, use storybook:

```
npm install
npm run storybook
```

and then open the browser at: [http://localhost:6006/](http://localhost:6006/)

## Make your first page commentable
We have a sample page with a Title and a couple of paragraphs
```
class SamplePage extends React.Component {
  render() {
    return (
      <h1>Text Title 1</h1>
      <p>Paragraphs are separated by a blank line.</p>
      <p>
        2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists look like:
      </p>
    )
  }
}

```

The steps we need to make this page commentable are the following:

* Define the commentable area and assign a `resource` identifier
* Identify the single references in the text
* Assign a service for the backend integration
* Assign a component to show/add the comments related to a reference

##### Define the commentable area and assign a `resource` identifier
This step is done wrapping the interested area in a `Resource` component and assigning the `resource`

```
import { Resource } from '@nearform/comments-react-components'

class SamplePage extends React.Component {
  render() {
    return (
      <Resource resource="my-resource">
        <h1>Text Title 1</h1>
        <p>Paragraphs are separated by a blank line.</p>
        <p>
          2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists look like:
        </p>
      </Resource>
    )
  }
}

```

##### Identify the single references in the text
Every part we woul'd like to reference should be wrapped around a `Reference`. This operation can be easily automated.

```
import { Resource, Reference } from '@nearform/comments-react-components'

class SamplePage extends React.Component {
  render() {
    return (
      <Resource resource="my-resource">
        <Reference reference="reference-1">
          <h1>Text Title 1</h1>
        </Reference>
        <Reference reference="reference-2">
          <p>Paragraphs are separated by a blank line.</p>
        </Reference>
        <Reference reference="reference-3">
          <p>
            2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists look like:
          </p>
        </Reference>
      </Resource>
    )
  }
}

```

##### Assign a service for the backend integration
Now that the component is correctly wrapped, we need to configure the service that allows the backend integration.


```
import {
  Resource,
  Reference,
  CommentsFetchService
} from '@nearform/comments-react-components'

const commentsFetchService = CommentsFetchService('http://localhost:8080/')

class SamplePage extends React.Component {
  render() {
    return (
      <Resource resource="my-resource" service={commentsFetchService}>
        <Reference reference="reference-1">
          <h1>Text Title 1</h1>
        </Reference>
        <Reference reference="reference-2">
          <p>Paragraphs are separated by a blank line.</p>
        </Reference>
        <Reference reference="reference-3">
          <p>
            2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists look like:
          </p>
        </Reference>
      </Resource>
    )
  }
}

```

##### Assign a component to show/add the comments related to a reference
To provide this feature we need to wrap everithing inside a SidebarsController and add the component that acts as a interface for the user to show the comments and add new ones and remove the existents


```
import {
  Resource,
  Reference,
  CommentsFetchService,
  SidebarsController,
  Sidebar
} from '@nearform/comments-react-components'

const commentsFetchService = CommentsFetchService('http://localhost:8080/')

class SamplePage extends React.Component {
  render() {
    return (
      <SidebarsController>
        <Resource resource="my-resource" service={commentsFetchService}>
          <Reference reference="reference-1">
            <h1>Text Title 1</h1>
          </Reference>
          <Reference reference="reference-2">
            <p>Paragraphs are separated by a blank line.</p>
          </Reference>
          <Reference reference="reference-3">
            <p>
              2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists look like:
            </p>
          </Reference>
          <Sidebar />
        </Resource>
      </SidebarsController>
    )
  }
}

```

***The page is now commentable!***

check the [stories](./stories) folder for further examples



### Components

* `<Resource/>`: To make an area commentable it should be wrapped around a `<Resource>` component. This component manage the state.
* `<Reference/>`: Every commentable part should be wrapped around a `<Reference>` component. This is currently the smallest part commentable, all the comments related to his children will be connected to the parent element.

#### A page sample

```
<Resource
  resource="main"
  service={buildService()} // This is a service you must provide
  eventsManagerComponent={EventsManager} // This prop is optional and must be a descendant of CommentsEventManager
>
    <div style={{ marginLeft: '30px' }}>
      <Reference reference="comm-1">
        <h1>Text Title 1</h1>
      </Reference>
      <Reference reference="comm-2">
        <p>Paragraphs are separated by a blank line.</p>
      </Reference>
    </div>
</Resource>
```

## Resource
The provider is the `commentable` root component.
It wraps the other commentable elements and provides them with what they need to handle comments.
Under the hood it uses [React 16 context api](#) and it manages a local state and the creation/update/deletion of comments.

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

Even if the common use case will have a single provider per page, the library allow to use multiple providers; each with is own `reference` and `service`.
The state is not then shared between providers and each one manage is own.

`new CommentsState(options: CommentsStateOptions): CommentsState`

***This operation is not required, is done by the current Resource***


#### CommentsStateOptions
* resource: string - The resource related to the state
* service: Service - An object handling the connection with the backend ([doc](####services))
* getProviderState: func - A function that returns the current provider state
* onCommentsStateUpdate: func - A function that updates the current provider state
* logger: Logger - The logger, if is not passed `console` is used


***note:***
The CommentState doesn't store locally the state but uses the provider state, this is why the getProvidedState and the onCommentsStateUpdate are required.

The state is available in the provider in the field 'commentsState'

*The provider state example*
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
The state structure is composed by the following properties

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
The comments state is accessed using the provided selectors.
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
* CommentsNesService - To connect to the server with a websocket

*an additional `CommentsInMemoryService` is available and can be used in tests and storybook.*

```
import { CommentsNesService } from '@nearform/comments-react-components'

const commentsNesService = CommentsNesService('ws://localhost:8080/')

render() {
  <Resource resource="res-1" service={commentsNesService}>
    ...
  </Resource>
}
```


#### addComment(resource: string, comment: Comment) => async Comment
Add a comment to the current resource.
the Comment object should be provided with the following information:
* content: string - The content of the comment (eg. 'some content')
* reference: Reference - The reference with an identifier (eg {id: 'ref-1'})

returns the added `comment` with all the data added by the server.

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



## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[comments]: https://github.com/nearform/comments/tree/master/packages
[license]: ./LICENSE.md
