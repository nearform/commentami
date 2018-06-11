import { Icon as IconBase } from '@nearform/commentami-react-components/dist/ui'
import React from 'react'

const icons = {
  comments: require('../../node_modules/@fortawesome/fontawesome-free-solid/faComments').icon,
  close: require('../../node_modules/@fortawesome/fontawesome-free-solid/faTimes').icon,
  trash: require('../../node_modules/@fortawesome/fontawesome-free-solid/faTrash').icon
}

export class Icon extends React.Component {
  render() {
    const [vbWidth, vbHeight, , , path] = icons[this.props.name]

    return <IconBase {...this.props} path={path} viewBox={`0 0 ${vbWidth} ${vbHeight}`} />
  }
}
