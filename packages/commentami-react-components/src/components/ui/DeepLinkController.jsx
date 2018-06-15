import React from 'react'
import queryString from 'query-string'
import { childrenPropInterface } from '../core/propInterfaces'

export const DeepLinkControllerContext = React.createContext('commentami-deeplink')

export class DeepLinkController extends React.Component {
  constructor(props) {
    super(props)

    const parsed = queryString.parse(global.window.location.search)

    this.state = {
      resource: parsed.resource || null,
      reference: parsed.reference || null,
      comment: parsed.comment || null,
      hasDeepLink: !!parsed.comment,
      unsetDeepLink: this.unsetDeepLink.bind(this),
      scrollIntoView: this.scrollIntoView.bind(this)
    }
  }

  scrollIntoView(element) {
    if (element && element.scrollIntoView) {
      element.scrollIntoView()
    }
  }

  unsetDeepLink() {
    this.setState({
      hasDeepLink: false,
      comment: null
    })
  }

  render() {
    return <DeepLinkControllerContext.Provider value={this.state} children={this.props.children} />
  }
}

DeepLinkController.displayName = 'DeepLinkController'

DeepLinkController.propTypes = {
  children: childrenPropInterface
}

export function withDeepLink(Component) {
  const WithDeepLink = function(props) {
    return (
      <DeepLinkControllerContext.Consumer>
        {state => <Component {...props} commentamiDeeplink={state} />}
      </DeepLinkControllerContext.Consumer>
    )
  }

  WithDeepLink.displayName = `WithDeepLink(${Component.displayName || Component.name})`

  return WithDeepLink
}
