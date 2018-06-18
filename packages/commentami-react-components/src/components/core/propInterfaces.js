import PropTypes from 'prop-types'

export const commentPropInterface = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      profileUrl: PropTypes.string,
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string
    })
  ]).isRequired,
  content: PropTypes.string
}

export const componentPropInterface = PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.node])
export const childrenPropInterface = PropTypes.oneOfType([
  PropTypes.arrayOf(componentPropInterface),
  componentPropInterface
])

export const flexibleRenderPropInterface = {
  render: PropTypes.func,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  children: childrenPropInterface
}

export const commentamiDeeplinkPropType = {
  resource: PropTypes.string,
  reference: PropTypes.string,
  comment: PropTypes.string,
  hasDeepLink: PropTypes.bool,
  unsetDeepLink: PropTypes.func
}

export const commentamiResourcePropInterface = {
  commentable: PropTypes.shape({
    addComment: PropTypes.func.isRequired,
    removeComment: PropTypes.func.isRequired
  }),
  isInit: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  initError: PropTypes.object,
  fetchError: PropTypes.object,
  updateError: PropTypes.object
}

export const commentamiReferencePropInterface = {
  ...commentamiResourcePropInterface,
  reference: PropTypes.string.isRequired,
  hasComments: PropTypes.bool.isRequired,
  addComment: PropTypes.func.isRequired,
  removeComment: PropTypes.func.isRequired,
  listReferenceComments: PropTypes.func.isRequired
}

export const referencePropInterface = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    id: PropTypes.string
  })
])

export const sidebarsControllerPropInterface = {
  resource: PropTypes.string,
  reference: PropTypes.string,
  isActive: PropTypes.func.isRequired,
  updateActive: PropTypes.func.isRequired,
  handleClick: PropTypes.func,
  handleContextMenu: PropTypes.func,
  handleDoubleClick: PropTypes.func,
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func,
  handleSelect: PropTypes.func
}
