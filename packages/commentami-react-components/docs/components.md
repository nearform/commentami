# Components

## Core components

### `<Resource/>`
To make an area commentable it should be wrapped in a `Resource` component. The component should be initialized using a `resource` prop that is used as a identifier and a `service` that provides the integration with the server.

The Resource exposes is state using the `ResourceContext`.

#### Example

```
import { Resource, WebsocketService } from '@nearform/commentami-react-components'
import { Reference } from '@nearform/commentami-react-components/dist/ui'

const service = WebsocketService('ws://localhost:8080/')

const CommentablePage= () => (
  <Resource resource="foo" service={service}>
    <Reference reference="title">
      <h2>Each text in this page is commentable. Just double click on it.</h2>
    </Reference>

    <Reference reference="p1">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
        egestas pulvinar lectus, at porttitor elit sodales a. Sed nec augue luctus, elementum eros quis, euismod
        ante. Maecenas vitae tempus mauris. Curabitur vel laoreet diam. Morbi varius nisi vitae aliquam porta.
        Suspendisse potenti. Proin tincidunt massa dui, sed placerat neque gravida non. Aenean fringilla magna
        eget sollicitudin volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc malesuada
        cursus nisi eu vehicula. Proin vel libero euismod, lacinia odio eget, iaculis erat.
      </p>
    </Reference>
  </Resource>
)
```

#### Props

Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
resource              | string   |                           |    Yes   | The identifier for the current `<Resource>` component
service               | [Service](./service.md)  |                           |    Yes   | Provides the integration with the server
logger                | Logger   | console                   |    No    | A logger object, if not set the `console` is used
children              | children |                           |    Yes   | The commentable blocks

### Hoc



#### withResource
A HOC that provides the functionality to work at `resource` level. It takes the value from the `ResourceContext` and adds the functionality related to the resource to a `commentami` prop.
It takes the current `resource` from the parent `<Resource>` component.

Exposes the `commentami`property with the following structure:

* commentable: Object - The `<Resource>` state exposed by the `ResourceContext` provider.
* resource: String - The resource identifier
* isInit: Boolean - Define if the `<Resource>` is initialized
* isFetching: Boolean -  Define if the `<Resource>` is fetching data
* isUpdating: Boolean -  Define if the `<Resource>` is updating data
* initError: Object -  Error in initialization phase
* fetchError: Object -  Error in fetching phase
* updateError: Object -  Error in updating phase


#### Example
```
import { withResource } from '@nearform/commentami-react-components'

const LoadingIndicatorBase = ({ commentami: { isInit, isFetching } }) => {
  if (isInit && !isFetching) return false

  return (
    <div>
      <div>Loading comments...</div>
    </div>
  )
})

const LoadingIndicator = withResource(LoadingIndicatorBase)
```

#### withReference
A HOC that provides the functionality to work at `reference` level. Inherith all the properties from the `withResource` HOC and adds the functionality related to a specific `reference` to the `commentami` property.

*The wrapped component should have a `reference` property defined. A warning is printed to console if the `reference` is missing.*

Exposes the `commentami`property with the following structure:

* All the property exposed by `withResource`
* reference: String|Object - The reference identifier
* hasComments: Boolean - Deefine if comments are related to the current `reference`
* addComment: Function(content: String) - Add a comment to the current `reference`
* removeComment: Function(comment: Comment) - Remove the comment
* listReferenceComments: Function - Retrieve the list of comments related to the current `reference`

#### Example
```
import { withReference } from '@nearform/commentami-react-components'

const CommentListBase = ({ commentami: { listReferenceComments, hasComments } }) => {
  if (!hasComments) {
    return (<div>No comments</div>)
  }

  return (
    <div>
      {listReferenceComments().map(comment => <CommentDetail comment={comment}/>)
    </div>
  )
})

const CommentList = withReference(CommentListBase)
```

## UI components

