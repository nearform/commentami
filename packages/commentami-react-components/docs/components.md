# Components

## Core components

### `<Resource/>`
To make an area commentable it should be wrapped in a `Resource` component. The component should be initialized using a `resource` prop that is used as a identifier and a `service` that provides the integration with the server.

The Resource exposes is state using the `ResourceContext`.

#### Example

```javascript
import { Resource, WebsocketService } from '@nearform/commentami-react-components'
import { Reference } from '@nearform/commentami-react-components/ui'

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

Exposes the `commentami` property with the following structure:

* commentable: Object - The `<Resource>` state exposed by the `ResourceContext` provider.
* resource: String - The resource identifier
* isInit: Boolean - Define if the `<Resource>` is initialized
* isFetching: Boolean -  Define if the `<Resource>` is fetching data
* isUpdating: Boolean -  Define if the `<Resource>` is updating data
* initError: Object -  Error in initialization phase
* fetchError: Object -  Error in fetching phase
* updateError: Object -  Error in updating phase


#### Example
```javascript
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

Exposes the `commentami` property with the following structure:

* All the property exposed by `withResource`
* reference: String|Object - The reference identifier
* hasComments: Boolean - Deefine if comments are related to the current `reference`
* addComment: Function(content: String) - Add a comment to the current `reference`
* removeComment: Function(comment: Comment) - Remove the comment
* listReferenceComments: Function - Retrieve the list of comments related to the current `reference`

#### Example
```javascript
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

#### withSidebars

A HOC that provides the functionality to interact with the closest parent `<SidebarsController>`.

It forwards all the received properties and it also exposes the `controller` property with the following structure:

* `resource: string` - The currently active resource.
* `reference: string` - The currently active reference.
* `isActive(resource: string, reference: string): boolean` - Check if the resource (and optionally the reference) is the currently active one.
* `updateActive(resource: string, reference: string): void`: Updates the currently active resource and reference. If the pair is already the active one, it clears the state.
* `handleClick(payload: object, event: Event)`: A optional handler for click events.
* `handleContextMenu(payload: object, event: Event)`: A optional handler for context menu events.
* `handleDoubleClick(payload: object, event: Event)`: A optional handler for double click events.
* `handleMouseEnter(payload: object, event: Event)`: A optional handler for mouse events.
* `handleMouseLeave(payload: object, event: Event)`: A optional handler for mouse events.
* `handleSelect(payload: object, event: Event)`: A optional handler for selection events.

For all the event handlers above, the payload should ideally contain the resource and reference that events belong to.

#### Example
```javascript
import { withSidebars } from '@nearform/commentami-react-components/ui'

class TogglerBase extends React.Component{
  constructor(props) {
    super(props)

    const payload = {
      resource: props.resource,
      reference: props.reference
      // Any additional data you might want to forward
    }

    this.boundHandleClick = props.controller.handleClick ? props.controller.handleClick.bind(null, payload) : this.handleClick.bind(this)
  }

  handleClick(ev) {
    ev.preventDefault()

    this.props.controller.updateActive(this.props.resource, this.props.reference)
  }

  render(){
    const isActive = this.props.controller.isActive(this.props.resource, this.props.reference)

    return (
      <div>
        <p>Currently I'm {isActive ? 'ON' : 'OFF'}!</p>
        <a href="#" onClick={this.boundHandleClick}>Toggle me!</a>
      </div>
    )
  }
}

const Toggler = withSidebars(TogglerBase)
```
## UI components

### `<Sidebar`>

A component which renders its contents using a portal appended to the document body. Its typical use (and default behavior) is to show a panel which lists all existings comments for a reference and also a form to insert a new comment.

The component **MUST** be placed inside a `<Resource/>` which in turn is inside a `<SidebarsController/>` component.

Depending on which props are provided, it will try to render using the first of the following strategy that matches:

1. Render using the `render` prop, if it is a function.
2. Render the component passed as the `component` prop.

All the additional provided props will be forwarded. Since it's a `withSidebars` HOC, it will also expose the `controller` prop.

```javascript
import { Resource, WebsocketService } from '@nearform/commentami-react-components'
import { Reference, Sidebar, SidebarsController } from '@nearform/commentami-react-components/ui'

const service = WebsocketService('ws://localhost:8080/')

const CommentablePage= () => (
  <SidebarsController>
    <Resource resource="foo" service={service}>
      <Reference reference="title">
        <h2>Each text in this page is commentable. Just double click on it.</h2>
      </Reference>

      <Reference reference="p1">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
          egestas pulvinar lectus, at porttitor elit sodales a. Sed nec augue luctus, elementum eros quis, euismod
          ante. Maecenas vitae tempus mauris. Curabitur vel laoreet diam. Morbi varius nisi vitae aliquam porta.
        </p>
      </Reference>

      <Sidebar/>
    </Resource>

    <Resource resource="bar" service={service}>
      <Reference reference="p1-2">
        <p>
          Suspendisse potenti. Proin tincidunt massa dui, sed placerat neque gravida non. Aenean fringilla magna
          eget sollicitudin volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc malesuada
          cursus nisi eu vehicula. Proin vel libero euismod, lacinia odio eget, iaculis erat.
        </p>
      </Reference>

      <Sidebar/>
    </Resource>
  </SidebarsController>
)
```

### `<SidebarsController/>`

A component that allows to synchronize which sidebar amongst its children is currently active. Its typical use is to allow one sidebar at a time to be visible.

Ideally, the component should be place at top-most level, so that all `<Resource/>` and `<Sidebar/>` component are placed inside its children.

The component acts a React context provider for the `withSidebars` HOC components, therefore it doesn't accept any prop and it just renders its children.

For an example, see the `<Sidebar/>` element above.