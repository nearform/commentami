# Components

## Core components

### `<Resource/>`

To make an area commentable it should be wrapped in a `Resource` component. The component should be initialized using a `resource` property that is used as a identifier and a `service` that provides the integration with the server.

The Resource exposes is state using the `ResourceContext`.

#### Example

```javascript
import { Resource, WebsocketService } from '@nearform/commentami-react-components'
import { Reference } from '@nearform/commentami-react-components/ui'

const service = WebsocketService('ws://localhost:8080/')

const CommentablePage = () => (
  <Resource resource="foo" service={service}>
    <Reference reference="title">
      <h2>Each text in this page is commentable. Just double click on it.</h2>
    </Reference>

    <Reference reference="p1">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
        egestas pulvinar lectus, at porttitor elit sodales a. Sed nec augue luctus, elementum eros quis, euismod ante.
        Maecenas vitae tempus mauris. Curabitur vel laoreet diam. Morbi varius nisi vitae aliquam porta. Suspendisse
        potenti. Proin tincidunt massa dui, sed placerat neque gravida non. Aenean fringilla magna eget sollicitudin
        volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc malesuada cursus nisi eu vehicula.
        Proin vel libero euismod, lacinia odio eget, iaculis erat.
      </p>
    </Reference>
  </Resource>
)
```

#### Props

| property | Type                    | Default   | Required | Description                                           |
| -------- | ----------------------- | --------- | -------- | ----------------------------------------------------- |
| resource | `string`                |           | Yes      | The identifier for the current `<Resource>` component |
| service  | [Service](./service.md) |           | Yes      | Provides the integration with the server              |
| logger   | `Logger`                | `console` | No       | A logger object, if not set the `console` is used     |
| children | `Node | Array<Node>`    |           | Yes      | The commentable blocks                                |

### Hoc

#### withResource

A HOC that provides the functionality to work at `resource` level. It takes the value from the `ResourceContext` and adds the functionality related to the resource to a `commentami` property.
It takes the current `resource` from the parent `<Resource>` component.

Exposes the `commentami` property with the following structure:

```typescript
interface CommentamiResource {
  commentable: object // The `<Resource>` state exposed by the `ResourceContext` provider.
  resource: string // The resource identifier
  isInit: boolean // Define if the `<Resource>` is initialized
  isFetching: boolean // Define if the `<Resource>` is fetching data
  isUpdating: boolean // Define if the `<Resource>` is updating data
  initError: object // Error in initialization phase
  fetchError: object // Error in fetching phase
  updateError: object // Error in updating phase
}
```

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

_The wrapped component should have a `reference` property defined. A warning is printed to console if the `reference` is missing._

Exposes the `commentami` property with the following structure:

```typescript
interface CommentamiReference extends CommentamiResource {
  reference: string | object // The reference identifier
  hasComments: boolean // Define if comments are related to the current `reference`
  addComment: (content: string) => Comment // Add a comment to the current `reference`
  removeComment: (comment: Comment) => void // Remove the comment
  listReferenceComments: () => Array<Comment> // Retrieve the list of comments related to the current `reference`
}
```

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

```typescript
interface Controller {
  resource: string // The currently active `resource`
  reference: string // The currently active `reference`
  isActive: (resource: string, reference: string) => boolean // Check if the resource (and optionally the reference) is the currently active one
  updateActive: (resource: string, reference: string) => void // Updates the currently active resource and reference. If the pair is already the active one, it clears the state
  handleClick: (payload: object, event: Event) => void // A optional handler for click events
  handleContextMenu: (payload: object, event: Event) => void // A optional handler for context menu events
  handleDoubleClick: (payload: object, event: Event) => void // A optional handler for double click events
  handleMouseEnter: (payload: object, event: Event) => void // A optional handler for mouse events
  handleMouseLeave: (payload: object, event: Event) => void // A optional handler for mouse events
  handleSelect: (payload: object, event: Event) => void // A optional handler for selection events
}
```

For all the event handlers above, the payload should ideally contain the resource and reference that events belong to.

#### Example

```javascript
import { withSidebars } from '@nearform/commentami-react-components/ui'

class TogglerBase extends React.Component {
  constructor(props) {
    super(props)

    const payload = {
      resource: props.resource,
      reference: props.reference
      // Any additional data you might want to forward
    }

    this.boundHandleClick = props.controller.handleClick
      ? props.controller.handleClick.bind(null, payload)
      : this.handleClick.bind(this)
  }

  handleClick(ev) {
    ev.preventDefault()

    this.props.controller.updateActive(this.props.resource, this.props.reference)
  }

  render() {
    const isActive = this.props.controller.isActive(this.props.resource, this.props.reference)

    return (
      <div>
        <p>Currently I'm {isActive ? 'ON' : 'OFF'}!</p>
        <a href="#" onClick={this.boundHandleClick}>
          Toggle me!
        </a>
      </div>
    )
  }
}

const Toggler = withSidebars(TogglerBase)
```

## UI components

### `<CommentsList/>`

A component which renders the list of comments for a specific reference. The component used for rendering each comment (`<DefaultComment/>` by default) can be customized by passing the `commentComponent` property.

Since it's a `withReference` HOC, it uses the `commentami` property. The non-HOC `<CommentsListBase/>` component is also exported, where the developer is responsible to ensure a valid `commentami` property is provided.

#### Props

| property         | Type                         | Default             | Required | Description                                 |
| ---------------- | ---------------------------- | ------------------- | -------- | ------------------------------------------- |
| reference        | `string`                     |                     | Yes      | The reference to show comments for          |
| title            | `string`                     |                     | No       | A title to render before the comments       |
| className        | `string`                     |                     | No       | The CSS class for the element               |
| commentComponent | `function | React.Component` | `<DefaultComment/>` | No       | The component to use to render each comment |

#### Example

```javascript
import { Resource, WebsocketService } from '@nearform/commentami-react-components'
import { CommentsList, Reference } from '@nearform/commentami-react-components/ui'

const service = WebsocketService('ws://localhost:8080/')

const CommentablePage = () => (
  <Resource resource="foo" service={service}>
    <Reference reference="p1">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
        egestas pulvinar lectus, at porttitor elit sodales a. Sed nec augue luctus, elementum eros quis, euismod ante.
        Maecenas vitae tempus mauris. Curabitur vel laoreet diam. Morbi varius nisi vitae aliquam porta.
      </p>
    </Reference>

    <CommentsList reference="p1" />
  </Resource>
)
```

### `<Icon/`>

A component which renders a small SVG icon.

#### Props

| property  | Type     | Default                  | Required | Description                   |
| --------- | -------- | ------------------------ | -------- | ----------------------------- |
| path      | `string` |                          | Yes      | The SVG path of the icon      |
| width     | `number` | The value of `size`      | No       | The icon width                |
| height    | `number` | The value of `width`     | No       | The icon height               |
| viewBox   | `string` | `0 0 ${width} ${height}` | No       | The SVG viewBox               |
| className | `string` | nf-commentami-icon         | No       | The CSS class for the element |
| size      | `number` |                          | No       | The icon size                 |

#### Example

```javascript
import { Icon } from '@nearform/commentami-react-components/ui'

const service = WebsocketService('ws://localhost:8080/')

const Page = () => (
  <Icon
    viewBox="0 0 96 96"
    path="M77.1,24.7c0-3.2-2.6-5.8-5.8-5.8H24.7c-3.2,0-5.8,2.6-5.8,5.8v35c0,3.2,2.6,5.8,5.8,5.8h40.8 l11.7,11.7L77.1,24.7z M65.5,53.8h-35V48h35V53.8z M65.5,45.1h-35v-5.8h35V45.1z M65.5,36.3h-35v-5.8h35V36.3z"
  />
)
```

### `<NewCommentForm/`>

A component which renders a small form to insert new comments.

Since it's a `withReference` HOC, it uses the `commentami` property. The non-HOC `<NewCommentFormBase/>` component is also exported, where the developer is responsible to ensure a valid `commentami` property is provided.

To customize its appearance, it uses several BEM CSS classes (`${mainClassName}` in the table below it's the value of the `className` property, described later):

| Class                                 | Description              |
| ------------------------------------- | ------------------------ |
| `${mainClassName}__title`             | The title element        |
| `${mainClassName}__textarea`          | The textarea element     |
| `${mainClassName}__button`            | The form buttons         |
| `${mainClassName}__button--primary`   | The form "Save" button   |
| `${mainClassName}__button--secondary` | The form "Cancel" button |
| `${mainClassName}__error`             | The error label element  |

Since there is no layout markup, we recommend the usage of the CSS Grid to arrange elements.

#### Props

| property         | Type     | Default                    | Required | Description                                              |
| ---------------- | -------- | -------------------------- | -------- | -------------------------------------------------------- |
| reference        | `string` |                            | Yes      | The reference to show comments for                       |
| title            | `string` | `Add new comment`          | No       | A title to render before the form                        |
| className        | `string` | `nf-commentami-new-form`     | No       | The CSS class for the element                            |
| placeholder      | `string` | `Enter some text ...`      | No       | The placeholder for the textarea                         |
| cancelLabel      | `string` | `Cancel`                   | No       | The label of the cancel button                           |
| submitLabel      | `string` | `Add`                      | No       | The label of the submit button                           |
| savingLabel      | `string` | `Saving ...`               | No       | The label of the submit button while save is in progress |
| errorPrefixLabel | `string` | `Cannot save the comment:` | No       | The leading text of the error label                      |

#### Example

```javascript
import { Resource, WebsocketService } from '@nearform/commentami-react-components'
import { NewCommentForm, Reference } from '@nearform/commentami-react-components/ui'

const service = WebsocketService('ws://localhost:8080/')

const CommentablePage = () => (
  <Resource resource="foo" service={service}>
    <Reference reference="p1">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
        egestas pulvinar lectus, at porttitor elit sodales a. Sed nec augue luctus, elementum eros quis, euismod ante.
        Maecenas vitae tempus mauris. Curabitur vel laoreet diam. Morbi varius nisi vitae aliquam porta.
      </p>
    </Reference>

    <NewCommentForm reference="p1" />
  </Resource>
)
```

### `<Reference/`>

A component which is used to mark all its content as "commentable". Then it renders its children. It **MUST** be place inside a `<Resource/>` component.

When comments are present for the reference, it also renders a "marker" component (by default `<DefaultMarker/>`) before its children. The marker click event will be handled by the reference double-click handler.

If also put within a `<SidebarsController/>`, it will track its active status by enabling the `activeClassName` CSS class when appropriate. Also, all events handling will be handled by the controller.

Its appearance can be customized by providing a CSS class name via `className` and `activeClassName` properties.

Since it's a `withReference` and `withSidebars` HOC, it uses the `commentami` and `controller` property. The non-HOC `<ReferenceBasse/>` component is also exported, where the developer is responsible to ensure valid `commentami` and `controller` property are provided.

#### Props

| property        | Type                         | Default                 | Required | Description                                    |
| --------------- | ---------------------------- | ----------------------- | -------- | ---------------------------------------------- |
| reference       | `string`                     |                         | Yes      |                                                |
| children        | `Node | Array<Node>`         |                         | Yes      | The reference contents                         |
| className       | `string`                     | 'nf-commentami-reference' | No       | The CSS class for the element                  |
| activeClassName | `string`                     | `${className}--active`  | No       | The CSS class for the element when is "active" |
| markerComponent | `function | React.Component` | `<DefaultMarker/>`      | No       | The component to use to render the marker      |

#### Example

`<Reference/>` elements are present in each example of other components.

### `<Sidebar/`>

A component which renders its contents using a portal appended to the document body. Its typical use (and default behavior) is to show a panel which lists all existings comments for a reference and also a form to insert a new comment.

The component **MUST** be placed inside a `<Resource/>` which in turn is inside a `<SidebarsController/>` component.

Depending on which props are provided, it will try to render using the first of the following strategy that matches:

1.  Render using the `render` prop, if it is a function.
2.  Render the component passed as the `component` property.

All the additional provided props will be forwarded. Since it's a `withSidebars` HOC, it will also expose the `controller` property.

Its appearance can be customized by providing a CSS class name via `className` property (default is `nf-commentami-sidebar`).

```javascript
import { Resource, WebsocketService } from '@nearform/commentami-react-components'
import { Reference, Sidebar, SidebarsController } from '@nearform/commentami-react-components/ui'

const service = WebsocketService('ws://localhost:8080/')

const CommentablePage = () => (
  <SidebarsController>
    <Resource resource="foo" service={service}>
      <Reference reference="title">
        <h2>Each text in this page is commentable. Just double click on it.</h2>
      </Reference>

      <Reference reference="p1">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
          egestas pulvinar lectus, at porttitor elit sodales a. Sed nec augue luctus, elementum eros quis, euismod ante.
          Maecenas vitae tempus mauris. Curabitur vel laoreet diam. Morbi varius nisi vitae aliquam porta.
        </p>
      </Reference>

      <Sidebar />
    </Resource>

    <Resource resource="bar" service={service}>
      <Reference reference="p1-2">
        <p>
          Suspendisse potenti. Proin tincidunt massa dui, sed placerat neque gravida non. Aenean fringilla magna eget
          sollicitudin volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc malesuada cursus
          nisi eu vehicula. Proin vel libero euismod, lacinia odio eget, iaculis erat.
        </p>
      </Reference>

      <Sidebar />
    </Resource>
  </SidebarsController>
)
```

### `<SidebarsController/>`

A component that allows to synchronize which sidebar amongst its children is currently active. Its typical use is to allow one sidebar at a time to be visible.

Ideally, the component should be place at top-most level, so that all `<Resource/>` and `<Sidebar/>` component are placed inside its children.

The component acts a React context provider for the `withSidebars` HOC components, therefore it doesn't accept any property and it just renders its children.

For an example, see the `<Sidebar/>` element above.

## Base UI Components

The components below implement base UI functionality. They are exported as reference classes for custom components and as default behaviors for the UI components described above.

### `<DefaultComment/>`

Renders a comment and, optionally, a remove button.

To customize its appearance, it uses several BEM CSS classes (`${mainClassName}` in the table below it's the value of the `className` property, described later):

| Class                             | Description              |
| --------------------------------- | ------------------------ |
| `${mainClassName}__header`        | The title element        |
| `${mainClassName}__content`       | The comment text element |
| `${mainClassName}__remove-button` | The remove button        |

#### Props

| property      | Type       | Default               | Required | Description                            |
| ------------- | ---------- | --------------------- | -------- | -------------------------------------- |
| comment       | `Comment`  |                       | Yes      | The comment to render                  |
| className     | `string`   | `nf-commentami-comment` | No       | The CSS class for the element          |
| removeComment | `function` |                       | No       | The handler to manage comment deletion |

### `<DefaultMarker/>`

A component which renders a `<Icon/>` when the reference is put within is "active". If put within a `<SidebarsController>` component, it toggles the active status of the reference when clicked.

Its appearance can be customized by providing a CSS class name via `className` property (default is `nf-commentami-marker`).

#### Props

| property   | Type         | Default              | Required | Description                   |
| ---------- | ------------ | -------------------- | -------- | ----------------------------- |
| controller | `Controller` |                      | No       | The sidebars controller       |
| resource   | `string`     |                      | No       | The resource it belongs to    |
| reference  | `string`     |                      | No       | The reference it belongs to   |
| rootRef    | `React.Ref`  |                      | No       | The root ref of the reference |
| className  | `string`     | `nf-commentami-marker` | No       | The CSS class for the element |

### `<DefaultSidebar/>`

A component which renders a `<NewCommentForm/>` and a `<CommentsList/>` for a reference.

If put within a `<SidebarsController>` component, it also renders a button to set the reference as "inactive" (and therefore hiding the sidebar).

Its appearance can be customized by providing a CSS class name via `className` property (default is `nf-commentami-sidebar`).

To customize its appearance, it uses several BEM CSS classes (`${mainClassName}` in the table below it's the value of the `className` property, described later):

| Class                      | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| `${mainClassName}__header` | The header element, which contains the title and the close button |
| `${mainClassName}__title`  | The sidebar element                                               |
| `${mainClassName}__close`  | The close button                                                  |

#### Props

| property   | Type         | Default              | Required | Description                   |
| ---------- | ------------ | -------------------- | -------- | ----------------------------- |
| controller | `Controller` |                      | No       | The sidebars controller       |
| title      | `string`     |                      | No       | The sidebar title             |
| className  | `string`     | `nf-commentami-marker` | No       | The CSS class for the element |
