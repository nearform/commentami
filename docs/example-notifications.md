# Real time notifications and deep linking

In our system a notification object has the following model:

```
{
  comment: {
    ...
  },
  action: '...',
  url: '...'
}
```
The `comment` property is an object representing the commet related to the user notification. It has the same interface described in the main [documentation page](/#core-concepts).

The `action` property will be either `mention` or `involve`. With `mention` we mean that the user has been explicitly mentioned in the content of the comment. With `involve` we mean that a new comment has been added to a `resouce`/`reference` pair the user already commented on (aka: someone answered to her comment).

Last but not least `url`. This property is optional and it should contain a link to the comment.

## Backed

As of today, the server uses the users `username` to identify a user.

It's value is saved as the `author` of a comment and in the `mentions` array if one or more mentions `@<username>` are found in the comment content.

The mentions notifications process is automatic and will happen even if there is no authentication in place. As long as a client subscribe to the right channel (ie: `/users/{username}`), it will get notified if a mention happen.

The "answers to comment" notification process needs one of the following:

- the client provides an `author` field when adding a comment, or
- an [authentication strategy and the `getUserFromRequest` option](/example-auth-and-user-data#add-authentication)

Lastly, to create a deep link to the comment you should implement a `resolveUrl` function and pass it as follow to the plugin


```
await server.register([{
  plugin: require('@nearform/commentami-backend-hapi-plugin'),
  options: {
    ...,
    resolvers: {
      resolveUrl: async (comment) => {
        // ... given the comment, it returns the page that contains the specific resource/reference

        return baseUrl
      }
    }
  }
}])
```

This function should return the url relative to the comment's resource (ie: `http://www.my.site/the/page/of/the/resource`)

The plugin will then add its query parameters so that the react components will be able to understand what is the resource, reference and comment to show.

## Frontend

### Core components

You can start dealing with notifications by using the 2 components provided by `@nearform/commentami-react-components`

**`Notifications`**

The `Notifications` component accepts the following props

```
<Notifications
  userIdentifier={...}
  service={...}
/>
```

The `userIdentifier` is a string or a number that identify the user and that will be used to subscribe to the server notifications about that user.

The `service` should be an instance of the [`WebsocketService`](https://github.com/nearform/commentami/blob/master/packages/commentami-react-components/src/services/WebsocketService.js) or a similar object that exposes a [`onUserNotification`](https://github.com/nearform/commentami/blob/master/packages/commentami-react-components/src/services/WebsocketService.js#L92) function.

The `onUserNotification` accepts two parameters: a `userIdentifier` and a handler function for when a notification is sent for that user. It returns an `unsubscribe` function that should be called when the client wants to stop receiving notifications on that user.

The notifications state passed down by the `NotificationsContext` has the following properties:

- `notifications`: this is an array containing all the notifications that need to be displayed
- `removeNotificationFromList`: this is a function that will remove a specific notification from the `notifications` array

**As of today there is no concept of "unread" notifications, nor a list of all received notifications.**

The notifications listed will be only the ones received after the loading of the `Notifications` component, and the only way to remove them from the list is the `removeNotificationFromList` function.

**`NotificationsWrapper`**

The `NotificationsWrapper` is a HOC that can pass the `NotificationsContext` state to the components it wraps.


### Examples of UI components

```javascript
// show the notifications number

import React from 'react'
import { NotificationsWrapper } from '@nearform/commentami-react-components'

class Box extends React.Component {
  render() {
    const { notifications } = this.props

    return <div className={this.props.className}>{(notifications && notifications.length) || 0}</div>
  }
}

export const NotificationsBox = NotificationsWrapper(Box)
```

```javascript
// show the list of notifications

import React from 'react'
import { NotificationsWrapper } from '@nearform/commentami-react-components'

class NotificationItem extends React.Component {
  render() {
    return (
      <div className={notificationsItemClass}>
        <span>Notification!!</span>
        <div>{this.props.notification.comment.content}</div>
        {this.props.notification.link && <a href={this.props.notification.link}>Link to see the comment</a>}
        <button onClick={this.props.onRemove}>X</button>
      </div>
    )
  }
}

class List extends React.Component {
  render() {
    if (!this.props.notifications || this.props.notifications.length === 0) return null

    return (
      <div className={this.props.className}>
        <h2 className={notificationsTitleClass}>Notifications</h2>

        {this.props.notifications.map(notification => (
          <NotificationItem
            key={notification.comment.id}
            notification={notification}
            onRemove={() => this.props.removeNotificationFromList(notification)}
          />
        ))}
      </div>
    )
  }
}

export const NotificationsList = NotificationsWrapper(List)
```
