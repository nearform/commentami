import { viewHeight } from 'csx'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getStyles, style } from 'typestyle'
import { Spinner } from './components/spinner'
import { debugClassName, mainClassName } from './styling/environment'
import './styling/reset'
import './styling/rules'

const rootClassName = style(debugClassName('root'), {
  display: 'flex',
  minHeight: viewHeight(100)
})

const body = renderToStaticMarkup(
  <React.Fragment>
    <div id="root" className={rootClassName}>
      <div id="main" className={mainClassName}>
        <Spinner />
      </div>
    </div>
  </React.Fragment>
)

const index = renderToStaticMarkup(
  <html lang="en">
    <head>
      <title>Comments Demo Application</title>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet="utf8" />
      <meta name="description" content="Comments Demo Application" />
      <meta name="keywords" content="comments, demo" />
      <meta name="author" content="nearForm" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/images/favicon.png" sizes="32x32" />
      <link rel="shortcut icon" href="images/favicon.png" sizes="196x196" />

      <style dangerouslySetInnerHTML={{ __html: getStyles() }} />
      <script defer type="text/javascript" src="/app.js" />
    </head>
    <body dangerouslySetInnerHTML={{ __html: body }} />
  </html>
)

export default index
