# Frontend Examples

This example will show you how to use the React components to build and customize the client.

## A commentable page

We have a simple text and we would like to make it commentable.

```
  <h1>Welcome!</h1>
  <h2>Each text in this page is commentable. Just double click on it.</h2>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
    egestas pulvinar lectus, at porttitor elit sodales a. Sed nec augue luctus, elementum eros quis, euismod
    ante. Maecenas vitae tempus mauris. Curabitur vel laoreet diam. Morbi varius nisi vitae aliquam porta.
    Suspendisse potenti. Proin tincidunt massa dui, sed placerat neque gravida non. Aenean fringilla magna
    eget sollicitudin volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc malesuada
    cursus nisi eu vehicula. Proin vel libero euismod, lacinia odio eget, iaculis erat.
  </p>
  <p>
    Proin et dolor metus. Ut leo est, pretium sed interdum ut, imperdiet nec est. Aenean porta elit non elit
    finibus finibus. Proin malesuada, lorem sit amet placerat congue, lectus ligula porta sem, at pellentesque
    ante urna eget turpis. Quisque volutpat neque eget rutrum volutpat. Cras dignissim, justo vitae porta
    viverra, quam nibh porta dolor, vel pharetra lacus ipsum non purus. Duis lacinia urna auctor, sodales
    mauris in, blandit orci. Aenean sagittis orci eu tempus feugiat. Pellentesque varius dolor iaculis,
    tincidunt lectus at, volutpat sapien. Sed nec feugiat dolor. Nulla accumsan pretium nulla, sit amet tempus
    nunc aliquet non. Nunc imperdiet imperdiet rhoncus.
  </p>
  <p>
    Vestibulum at ipsum tempus, laoreet erat ac, congue lectus. Nulla non cursus augue. Cras mollis vel ipsum
    eu posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris
    vestibulum, elit quis auctor mollis, dui est tincidunt augue, in aliquet eros erat vitae libero. Nam sed
    finibus turpis. Praesent maximus libero sed nibh ornare ornare. Vestibulum commodo sem id metus placerat
    hendrerit.
  </p>
```

To make the page commentable we need to do various steps:

  * Define the commentable area
  * Assign references to the text blocks
  * Add a sidebar that will allow to add a new comment and shows the comments list
  * Add a deeplink manager that takes the url properties and open the sidebar in the right position with the comment highlighted

Let's start from the end result. In the image below you can see how the Commentami Components are used.

***In the image below an example of commentable page.***
![Components](./images/components.png "Components")

A comment is located in the system using 2 positional identifiers: a`resource` and a `reference`.

The `resource` identifies the area (eg. a page, a table) and the `reference` indentifies the specific part of the resource (eg. a text block, a cell)

### Resource

To define a commentable area you can use the `<Resource>` component.

Given the previous page definition we would like to define the `<p>` commentable, as a first step we need to wrap the block inside the `<Resource>` component, passing a `resource` prop.

```
  <h1>Welcome!</h1>
  <h2>Each text in this page is commentable. Just double click on it.</h2>
  <Resource resource="resource-1">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
      egestas pulvinar lectus, at porttitor...
    </p>
    <p>
      Proin et dolor metus. Ut leo est, pretium sed interdum ut, imperdiet nec est. Aenean porta elit non elit
      finibus finibus. Proin malesuada...
    </p>
    <p>
      Vestibulum at ipsum tempus, laoreet erat ac, congue lectus. Nulla non cursus augue. Cras mollis vel ipsum
      eu posuere. Vestibulum ante ipsum primis...
      hendrerit.
    </p>
  </Resource>
```

### Reference

Now that the area is defined the `<p>` blocks should be tagged as references using the `<Reference>` component.

```
  <h1>Welcome!</h1>
  <h2>Each text in this page is commentable. Just double click on it.</h2>
  <Resource resource="resource-1">
    <Reference reference="p1">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
        egestas pulvinar lectus, at porttitor...
      </p>
    </Reference>
    <Reference reference="p2">
      <p>
        Proin et dolor metus. Ut leo est, pretium sed interdum ut, imperdiet nec est. Aenean porta elit non elit
        finibus finibus. Proin malesuada...
      </p>
    </Reference>
    <Reference reference="p3">
      <p>
        Vestibulum at ipsum tempus, laoreet erat ac, congue lectus. Nulla non cursus augue. Cras mollis vel ipsum
        eu posuere. Vestibulum ante ipsum primis...
        hendrerit.
      </p>
    </Reference>
  </Resource>
```

To make the `<Reference>` interact with the other components (sidebar and comments list), we need to wrap the page into a `<SidebarsControllers>`.

### SidebarsController

The sidebar controller provides the feature to interact with the othe ui components and manage the DoubleClick event that opens the comments sidebar specific for each `reference`.

```
  <SidebarsController>
    <h1>Welcome!</h1>
    <h2>Each text in this page is commentable. Just double click on it.</h2>
    <Resource resource="resource-1">
      <Reference reference="p1">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
          egestas pulvinar lectus, at porttitor...
        </p>
      </Reference>
      <Reference reference="p2">
        <p>
          Proin et dolor metus. Ut leo est, pretium sed interdum ut, imperdiet nec est. Aenean porta elit non elit
          finibus finibus. Proin malesuada...
        </p>
      </Reference>
      <Reference reference="p3">
        <p>
          Vestibulum at ipsum tempus, laoreet erat ac, congue lectus. Nulla non cursus augue. Cras mollis vel ipsum
          eu posuere. Vestibulum ante ipsum primis...
          hendrerit.
        </p>
      </Reference>
    </Resource>
  <SidebarsController>
```

### Sidebar

Now that the SidebarController is in place, we need to add a Sidebar. The `<Sidebar>` component will show the comment form and the comments list, and will interact with the controller to add new comment and the list of existing ones.

The SidebarController has a default sidebar but it;s very basic. To override it, put a custom `<SideBar>` component inside the <Resource> component.

```
  <SidebarsController>
    <h1>Welcome!</h1>
    <h2>Each text in this page is commentable. Just double click on it.</h2>
    <Resource resource="resource-1">
      <Reference reference="p1">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
          egestas pulvinar lectus, at porttitor...
        </p>
      </Reference>
      <Reference reference="p2">
        <p>
          Proin et dolor metus. Ut leo est, pretium sed interdum ut, imperdiet nec est. Aenean porta elit non elit
          finibus finibus. Proin malesuada...
        </p>
      </Reference>
      <Reference reference="p3">
        <p>
          Vestibulum at ipsum tempus, laoreet erat ac, congue lectus. Nulla non cursus augue. Cras mollis vel ipsum
          eu posuere. Vestibulum ante ipsum primis...
          hendrerit.
        </p>
      </Reference>
      <Sidebar>
    </Resource>
  </SidebarsController>
```

### Backend socket integration

The connection with the backend is done passing a `service` directly in the `<Resource>` component.


```javascript
import { WebsocketService, buildWebsocketClient } from '@nearform/commentami-react-components'

// Create the client and initilize the right authorization params
const client = buildWebsocketClient('ws://127.0.0.1:8080')
await client.connect({ auth: { headers: { authorization: this.props.authorization } } })

// Create the service
const websocketService =  WebsocketService(client)

// Assign the service
<Resource resource="resource-1" service={websocketService}>
  ...
</Resource>
```

### Use the deeplinking feature

Adding a `<DeepLinkController>` it's possible to access directly to a comment.

```
<DeepLinkController>
  <SidebarsController>
    <h1>Welcome!</h1>
    <h2>Each text in this page is commentable. Just double click on it.</h2>
    <Resource resource="resource-1">
      ...
    </Resource>
  </SidebarsController>
</DeepLinkController>
```

When the page is loaded with the following query paramenters `http://someurl/somepage/?resource=RESOURCE&reference=REFERENCE&comment=12345`, it will trigger the scroll into view of the `Reference` component, the opening of the correct sidebar and scroll into view of the comment.

### The full implementation

```
<DeepLinkController>
  <SidebarsController>
    <h1>Welcome!</h1>
    <h2>Each text in this page is commentable. Just double click on it.</h2>
    <Resource resource="resource-1">
      <Reference reference="p1">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
          egestas pulvinar lectus, at porttitor...
        </p>
      </Reference>
      <Reference reference="p2">
        <p>
          Proin et dolor metus. Ut leo est, pretium sed interdum ut, imperdiet nec est. Aenean porta elit non elit
          finibus finibus. Proin malesuada...
        </p>
      </Reference>
      <Reference reference="p3">
        <p>
          Vestibulum at ipsum tempus, laoreet erat ac, congue lectus. Nulla non cursus augue. Cras mollis vel ipsum
          eu posuere. Vestibulum ante ipsum primis...
          hendrerit.
        </p>
      </Reference>
      <Sidebar>
    </Resource>
  </SidebarsController>
</DeepLinkController>
```

### `<Commentami>` component

The example above can be rewritten quickly using the `<Commentami>` component.

```
<Commentami resource="resource-1" service={service}>
  <h1>Welcome!</h1>
  <h2>Each text in this page is commentable. Just double click on it.</h2>
  <Reference reference="p1">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus eu lorem sit amet commodo. Morbi
      egestas pulvinar lectus, at porttitor...
    </p>
  </Reference>
  <Reference reference="p2">
    <p>
      Proin et dolor metus. Ut leo est, pretium sed interdum ut, imperdiet nec est. Aenean porta elit non elit
      finibus finibus. Proin malesuada...
    </p>
  </Reference>
  <Reference reference="p3">
    <p>
      Vestibulum at ipsum tempus, laoreet erat ac, congue lectus. Nulla non cursus augue. Cras mollis vel ipsum
      eu posuere. Vestibulum ante ipsum primis...
      hendrerit.
    </p>
  </Reference>
</Commentami>
```

The Commentami component has a limitation though. It allows only one `Resource` per page, but if you don't need many resource in a page, this is all you need to make it commentable!

### Customize the Sidebar
A new Sidebar component can be easily created using the `withSidebars` HOC and the `<NewCommentForm>` `<CommentsList>` components.

The withSidebars HOC provides a `controller` property that allow the interaction with the sidebars controller.


```javascript

// The CommentList component allow to pass a `commentComponent` propety to customize the comments rendering
class CustomComment extends React.Component {
  render() {
    const {content, author} = this.props.comment

    return (
      <article>
        <div>{content}</div>
        <div>by {author.username}</div>
        <button onClick={() => this.props.removeComment(this.props.comment)}>Remove</button>
      </article>
    )
  }
}


class CustomSidebarBase extends React.Component {
  constructor(props) {
    super(props)
    this.boundHandleClose = this.handleClose.bind(this)
  }

  handleClose(ev) {
    const payload = {
      scope: 'sidebar-close'
    }

    this.props.controller.handleClick(payload, ev)
  }

  render() {
    const reference = this.props.controller.reference
    return (
      <div>
        <header>
          <h1>Comments</h1>
          <a href="#" onClick={this.boundHandleClose}>
            Close
          </a>
        </header>
        <NewCommentForm reference={reference} />
        <CommentsList reference={reference} commentComponent={CustomComment}/>
      </div>
    )
  }
}

const CustomSidebar = withSidebars(CustomSidebarBase)

...
// The <CustomSidebar> can be used replacing the <Sidebar> component
<DeepLinkController>
  <SidebarsController>
    <Resource resource="resource-1">
      <Reference reference="p1">
        ...
      </Reference>
      <CustomSidebar>
    </Resource>
  </SidebarsController>
</DeepLinkController>

// using the <Commentami> component
<Commentami resource="resource-1" service={service} Sidebar={CustomSidebar}>
  <h1>Welcome!</h1>
  ...
</Commentami>
```

