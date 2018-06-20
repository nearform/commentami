import * as defaults from '../src/defaults'
import * as core from '../src/index'
import * as ui from '../src/ui'

describe('exports', () => {
  describe('core', () => {
    test('should export right modules', () => {
      expect(Object.keys(core).sort()).toEqual([
        'HttpService',
        'Notifications',
        'NotificationsContext',
        'NotificationsWrapper',
        'Resource',
        'WebsocketService',
        'buildWebsocketClient',
        'flexibleRender',
        'withReference',
        'withResource'
      ])
    })
  })

  describe('ui', () => {
    test('should export right modules', () => {
      expect(Object.keys(ui).sort()).toEqual([
        'CommentsList',
        'CommentsListBase',
        'DeepLinkController',
        'DeepLinkControllerContext',
        'Icon',
        'NewCommentForm',
        'NewCommentFormBase',
        'Reference',
        'ReferenceBase',
        'Sidebar',
        'SidebarBase',
        'SidebarsController',
        'SidebarsControllerContext',
        'withDeepLink',
        'withSidebars'
      ])
    })
  })

  describe('defaults', () => {
    test('should export right modules', () => {
      expect(Object.keys(defaults).sort()).toEqual(['DefaultComment', 'DefaultMarker', 'DefaultSidebar'])
    })
  })
})
