import React from 'react'
import { configure, addDecorator } from '@storybook/react'

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.story.js$/)

// To add a decorator
const decorator = story => <div style={{ margin: '10px' }}>{story()}</div>

function loadStories() {
  // addDecorator(decorator)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
