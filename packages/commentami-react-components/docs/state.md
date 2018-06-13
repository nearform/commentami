## The Comments State

You can have multiple provider on the same page. Every provider manages his own state using the `CommentState` component.

The `CommentState` is initialized at the component mounting and a new one is created when the `resource` reference in the provider changes.

```
new CommentsState(options: CommentsStateOptions): CommentsState
```

#### CommentsStateOptions

The CommentState will handle changes to the `<Resource>` state. This is why it needs `getProvidedState` and `onCommentsStateUpdate`. The state is available in the `<Resource>` instance in the field 'commentsState'.

* resource: String - the `resourse` related to the `<Resource>` instance
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

<a name="State"></a>

### State : `Object`
The state object

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | `string` | The resource identifier |
| references | <code>Object.<string, [Reference]></code> | The references stored in the resource |
| isInit | `boolean` | Identify if the state is initialized |
| initError | `null` \| `Object` | The initialization error |
| isFetching | `boolean` | Identify if the state is fetching data |
| fetchError | `null` \| `Object` | The fetching error |
| isUpdating | `boolean` | Identify if the state is updating |
| updateError | `null` \| `Object` | The updating error |


### Reference : <code>Object</code>
The reference object

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The Reference identifier |
| comments | <code>Object.&lt;string, [Comment]&gt;</code> | The comments related to the reference |


<a name="Comment"></a>

### Comment : <code>Object</code>
The comment object

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The Comment identifier |
| reference | [<code>Reference</code>](#Reference) | The reference that contains the comment |
| content | <code>string</code> | The text of the comment |
| author | <code>string</code> | The author of the comment, this will became a more complex structure in the future implementation |
| createdAt | <code>Timestamp</code> | The timestamp of the comment |

<a name="Reference"></a>

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

## Manage the state (Internal development only)
To manage the state some of reducers and helpers are provided.


### Creators

<a name="createComment"></a>

## createComment ⇒ [<code>Comment</code>](#Comment)
Create a new comment


| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The Comment identifier |
| reference | [<code>Reference</code>](#Reference) | The reference that contains the comment |
| content | <code>string</code> | The text of the comment |
| author | <code>string</code> | The author of the comment, this will became a more complex structure in the future implementation |
| createdAt | <code>Timestamp</code> | The timestamp of the comment |

<a name="createReference"></a>

## createReference ⇒ [<code>Reference</code>](#Reference)
Create a new Reference


| Param | Type | Description |
| --- | --- | --- |
| referenceOptions | [<code>Reference</code>](#Reference) | The reference object |
| referenceOptions.id | <code>string</code> | The reference identifier |


### Getters

<a name="getDefaultState"></a>

#### getDefaultState ⇒ <code>State</code>
Get the default state

<a name="getComment"></a>

#### getComment ⇒ [<code>Comment</code>](#Comment)


| Param | Type | Description |
| --- | --- | --- |
| reference | [<code>Reference</code>](#Reference) |  |
| commentOptions | [<code>Comment</code>](#Comment) | The comment options object |
| commentOptions.id | <code>string</code> | The comment identifier |

<a name="getReference"></a>

#### getReference ⇒ [<code>Reference</code>](#Reference)


| Param | Type | Description |
| --- | --- | --- |
| state | <code>State</code> |  |
| referenceOptions | [<code>Reference</code>](#Reference) | The reference options object |
| referenceOptions.id | <code>string</code> | The reference identifier |

### Reducers
<a name="initialize"></a>

#### initialize ⇒ [<code>State</code>](#State)
Begin the initialization phase



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |

<a name="initializeSuccess"></a>

#### initializeSuccess ⇒ [<code>State</code>](#State)
Set the initialization success result



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |

<a name="initializeFail"></a>

#### initializeFail ⇒ [<code>State</code>](#State)
Set the initialization error result



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |
| error | <code>object</code> |

<a name="fetching"></a>

#### fetching ⇒ [<code>State</code>](#State)
Init the fetching phase



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |

<a name="fetchingSuccess"></a>

#### fetchingSuccess ⇒ [<code>State</code>](#State)
Set the fetching success



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |

<a name="fetchingFail"></a>

#### fetchingFail ⇒ [<code>State</code>](#State)
Set the fetching error



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |
| error | <code>object</code> |

<a name="updating"></a>

#### updating ⇒ [<code>State</code>](#State)
Init the updating phase



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |

<a name="updatingSuccess"></a>

#### updatingSuccess ⇒ [<code>State</code>](#State)
Set the updating success



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |

<a name="updatingFail"></a>

#### updatingFail ⇒ [<code>State</code>](#State)
Set the updating error



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |
| error | <code>object</code> |


<a name="removeReference"></a>

#### removeReference ⇒ [<code>State</code>](#State)


| Param | Type | Description |
| --- | --- | --- |
| state | [<code>State</code>](#State) |  |
| referenceOptions | [<code>Reference</code>](#Reference) | The reference object |
| referenceOptions.id | <code>string</code> | The reference identifier |

<a name="setReference"></a>

#### setReference ⇒ [<code>State</code>](#State)
Set a reference in the current state,
if the reference exists, it's updated in the fields specified by the `reference` param



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |
| reference | [<code>Reference</code>](#Reference) |

<a name="setCommentToResource"></a>

#### setCommentToResource ⇒ [<code>State</code>](#State)
Set a comment in the state, specifying the reference



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |
| reference | [<code>Reference</code>](#Reference) |
| comment | [<code>Comment</code>](#Comment) |

<a name="removeCommentFromResource"></a>

#### removeCommentFromResource ⇒ [<code>State</code>](#State)
Remove a comment from the state, specifying the reference



| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) |
| reference | [<code>Reference</code>](#Reference) |
| comment | [<code>Comment</code>](#Comment) |


<a name="removeComment"></a>

#### removeComment ⇒ [<code>Reference</code>](#Reference)


| Param | Type | Description |
| --- | --- | --- |
| reference | [<code>Reference</code>](#Reference) |  |
| commentOptions | [<code>Comment</code>](#Comment) | The comment object |
| commentOptions.id | <code>string</code> | The comment identifier |

<a name="setComment"></a>

#### setComment ⇒ [<code>Reference</code>](#Reference)
Set a comment in the current reference,
if the comment exists, it's updated in the fields specified by the `comment` param


| Param | Type |
| --- | --- |
| reference | [<code>Reference</code>](#Reference) |
| comment | [<code>Comment</code>](#Comment) |

