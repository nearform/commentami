### Selectors

***The selectors are currently not exported, they are available only for internal use.***

The comments state is accessed using the provided selectors. The `state` required by the selector is available in every component as the `commentable` prop.
The selectors are currently used in the HOC components and are note exported from the library to avoid future breacking change.

#### referencesCount(state) => Number

Returns the number of references presents in the current resource

#### commentsCount(state, reference) => Number

Returns the number of comments related to a specific reference

#### selectCommentsByReference(state, reference) => Comments[]

Returns the comment list related to a specific reference

#### isInit(state) => Boolean

Returns the current init state, set to false until the initialization is done

#### initError(state) => Object

Returns the init error

#### isFetching(state) => Boolean

Returns the current fetching state, the state is fetching during load of the comments

#### fetchError(state) => Object

Returns the fetch error

#### isUpdating(state) => Boolean

Returns the current update state, the state is updating during the `add`or a `remove` action

#### updateError(state) => Object

Returns the update error


***Selector example***

```
import {selectCommentsByReference} from '@nearform/commentami-react-components'

const CustomComponent = (props) => {
  const comments = selectCommentsByReference(props.commentable, 'ref-1')
  return comments.map(comment => <SomeCommentDetailComponent comment={comment} />)
}
```
