# @nearform/commentami-react-components

`@nearform/commentami-react-components` is a ready to use set of React components to add commenting functionality on existing React applications.

It uses the [@nearform/commentami-backend-\*][commentami] packages as backend.

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
import { Resource } from '@nearform/commentami-react-components'

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

Every part we would like to comment should be wrapped around a `Reference`. This operation can be easily automated.

```
import { Resource, Reference } from '@nearform/commentami-react-components'

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
} from '@nearform/commentami-react-components'

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

To provide this feature we need to wrap everithing inside a SidebarsController and add the component that acts as a interface for the user to show the comments, add new ones or remove them.

```
import {
  Resource,
  Reference,
  CommentsFetchService,
  SidebarsController,
  Sidebar
} from '@nearform/commentami-react-components'

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

* `<Resource/>`: To make an area commentable, wrap it in a `<Resource>` component. This component manages the state of the comments for that area.
* `<Reference/>`: Every commentable section should be wrapped around a `<Reference>` component. This wraps the block that will be commentable and selected. It can contain simple text or multiple tags.

#### A page sample

```
<Resource
  resource="main"
  service={buildService()} // This is a service you must provide
  eventsManagerComponent={EventsManager} // This prop is optional, it has to extend CommentsEventManager
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

<<<<<<< Updated upstream
## Resource

The `Resource` is the root component of a commentable area. It needs a `resource` and a `service` to be initialized.

The `resource` is a string that identifies a section or the entire page. The `service` is a component that will handle the communications between the client and the server.

A `Resource` instance wraps the other commentable elements and provides them with what they need to handle comments. Under the hood it uses [React 16 context api](#) and it manages a local state and the creation/update/deletion of comments.

`Resource` will provide the following funcation to handle comments:

- `addComment(reference: Reference, content: string)`
- `removeComment(comment: Comment)`

## The Comments State

You can have multiple provider on the same page. Every provider manages his own state using the `CommentState` component.

The `CommentState` is initialized at the component mounting and a new one is created when the `resource` reference in the provider changes.

```
new CommentsState(options: CommentsStateOptions): CommentsState
```

#### CommentsStateOptions

The CommentState will handle changes to the `Resource` state. This is why it needs `getProvidedState` and `onCommentsStateUpdate`. The state is available in the `Resource` instance in the field 'commentsState'.

* resource: String - the `resourse` related to the `Resource` instance
* service: Object - what will handle communications with the server ([doc](####services))
* getProviderState: Function - function that will return the provider state
* onCommentsStateUpdate: Function - function that updates the state when something happens
* logger: Object - either a logger or by default it's the `console` object

*Provider state structure*

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

***Example structure***

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

The comments state is accessed using the provided selectors. The `state` required by the selector is available in every component as the `commentable` prop.

#### referencesCount(state) => Number

Returns the number of references presents in the current resource

#### commentsCount(state, reference) => Number

Returns the number of comments related to a specific reference

#### selectCommentsByReference(state, reference) => Comments[]

Returns the comment list related to a specific reference

***Selector example***

```
import {selectCommentsByReference} from '@nearform/commentami-react-components'

const CustomComponent = (props) => {
  const comments = selectCommentsByReference(props.commentable, 'ref-1')
  return comments.map(comment => <SomeCommentDetailComponent comment={comment} />)
}
```

### Services

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

## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[comments]: https://github.com/nearform/comments/tree/master/packages
[license]: ./LICENSE.md
