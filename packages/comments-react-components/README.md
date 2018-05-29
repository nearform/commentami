# @nearform/comments-react-components

comments-react-components is a ready to use set of React components to add commenting functionality on existing React applications.

It uses the [@nearform/comments-backend-\*][comments] packages as backend.

## Quick start

To explore components, use storybook:

```
npm install
npm run storybook
```

and then open the browser at: [http://localhost:6006/](http://localhost:6006/)

## First implemetation (POC)

The POC is just an architectural design attemp made to have a starting discussion point.
The Components created use the new React Context API (> 16).

### Components

* `<CommentableProvider/>`: To make an area commentable it should be wrapped around a `<CommentableProvider>` component. This component manage the state.
* `<CommentableBlock/>`: Every commentable part should be wrapped around a `<CommentableBlock>` component. This is currently the smallest part commentable, all the comments related to his children will be connected to the parent element.

#### A page sample

```
import { EventManager } from 'your/event/manager'

const service = buildService()

<CommentableProvider resource="main" service={...} eventsManagerComponent={EventsManager}>
    <div style={{ marginLeft: '30px' }}>
      <CommentableBlock referenceId="comm-1">
        <h1>Text Title 1</h1>
      </CommentableBlock>
      <CommentableBlock referenceId="comm-2">
        <p>Paragraphs are separated by a blank line.</p>
      </CommentableBlock>
    </div>
</CommentableProvider>
```

## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[comments]: https://github.com/nearform/comments/tree/master/packages
[license]: ./LICENSE.md
