import React from 'react'
import { render } from 'react-dom'
import { Route, Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { Header } from './components/header'
import { User } from './components/user'
import { IndexPage } from './pages/index'
import { MarkdownPage } from './pages/markdown'
import { PlainPage } from './pages/plain'
import { TablePage } from './pages/table'
import { MultiplePage } from './pages/multiple'
import { mainClassName } from './styling/environment'

document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root')
  root.innerHTML = ''

  render(
    <Router>
      <div id="main" className={mainClassName}>
        <User>
          <Header />

          <Switch>
            <Route exact path="/plain" component={PlainPage} />
            <Route exact path="/markdown" component={MarkdownPage} />
            <Route exact path="/table" component={TablePage} />
            <Route exact path="/multiple" component={MultiplePage} />
            <Route component={IndexPage} />
          </Switch>
        </User>
      </div>
    </Router>,
    root
  )
})
