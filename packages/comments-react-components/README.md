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
* `<CommentableTextBlock/>`: Every commentable part should be wrapped around a `<CommentableTextBlock>` component. This is currently the smallest part commentable, all the comments related to his children will be connected to the parent element.
* `<CommentIcon/>`: Is required to show the action `Icon`. If clicked shows the comments related to the block.
* `<CommentsBlock/>`: Shows the comments if a `CommentableTextBlock` is selected clicking the `CommentIcon`.

#### A page sample

```
 <CommentableProvider>
    <div style={{ marginLeft: '20px' }}>
      <CommentableTextBlock blockId="comm-1">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentIcon />
        </div>
        <h1>TextBlock 1</h1>
      </CommentableTextBlock>
      <CommentableTextBlock blockId="comm-2">
        <div style={{ position: 'absolute', left: '-0px' }}>
          <CommentIcon />
        </div>
        <p>Paragraphs are separated by a blank line.</p>
      </CommentableTextBlock>
    </div>
  <CommentsBlock />
</CommentableProvider>
```

## License

Copyright nearForm Ltd 2018. Licensed under [Apache 2.0 license][license].

[comments]: https://github.com/nearform/comments/tree/master/packages
[license]: ./LICENSE.md
