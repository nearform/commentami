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
    },
    isInit: false,
    initError: null,
    ...
  }
}

```

### The state structure

The state structure is composed by the following properties

#### Resource (Root object)

* id: String - The resource identifier
* references: <String, Reference> - An object containing all the references with at least a comment in the current `resource`

* isInit: bool - Define if the state is initialized
* initError: Object|null - The error in the initialization phase
* isFetching: bool - Define if the state is fetching data
* fetchError: Object|null - The error in the fetching operation
* isUpdating: bool - Define if the state is updating data
* updateError: Object|null - The error in the updating operation

#### Reference
* id: String - The reference identifier
* comments: <String, Comment> - An object containing all the comments connected to the `reference`

#### Comment
* id: String - The Comment identifier
* reference: Reference - The reference that contains the comment
* content: String - The text of the comment
* author: String - The author of the comment, this will became a more complex structure in the future implementation
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
  },

  isInit: false,
  initError: null,
  isFetching: false,
  fetchError: null,
  isUpdating: false,
  updateError: null
}
```
