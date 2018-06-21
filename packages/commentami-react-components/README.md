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

To make this page quickly commentable you need to:

* to wrap everything inside the `Commentami` component
* Define a service that manage the connection with the server
* add a reference to the each child

```
import {
  Commentami,
  Reference,
  HttpService
} from '@nearform/commentami-react-components'

const commentsHttpService = HttpService('http://localhost:8080/')

class SamplePage extends React.Component {
  render() {
    return (
      <Commentami resource="res-1" service={commentsHttpService}>
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
      </Commentami>
    )
  }
}
```

This solution allow to have quickly a single `resource` commentable per page.

**If you would like to have a more complex structure with many resources per page you need to use the specific components.**

The steps you need to make the page commentable using the specific components one by one are the following:

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

Every part you would like to comment should be wrapped around a `Reference`. This operation can be easily automated.

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

Now that the component is correctly wrapped, you need to configure the service that allows the backend integration.

```
import {
  Resource,
  Reference,
  HttpService
} from '@nearform/commentami-react-components'

const commentsHttpService = HttpService('http://localhost:8080/')

class SamplePage extends React.Component {
  render() {
    return (
      <Resource resource="my-resource" service={commentsHttpService}>
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

To provide this feature you need to wrap everithing inside a SidebarsController and add the component that acts as a interface for the user to show the comments, add new ones or remove them.

```
import {
  Resource,
  Reference,
  HttpService,
  SidebarsController,
  Sidebar
} from '@nearform/commentami-react-components'

const commentsHttpService = HttpService('http://localhost:8080/')

class SamplePage extends React.Component {
  render() {
    return (
      <SidebarsController>
        <Resource resource="my-resource" service={commentsHttpService}>
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

## Api and components

* [Components](./docs/components.md) - The React components provided by the library
* [Service](./docs/service.md) - The service provides the connection with the server
* [State](./docs/state.md) - The state structure
* [Selectors](./docs/selectors.md) - The selectors to retrieve data from the state


## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[commentami]: https://github.com/nearform/commentami/tree/master/packages
[license]: ./LICENSE.md
