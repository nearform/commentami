import * as defaults from '../src/defaults'
import * as core from '../src/index'
import * as ui from '../src/ui'

describe('exports', () => {
  describe('core', () => {
    test('should export right modules', () => {
      expect(Object.keys(core).sort()).toEqual([
        'HttpService',
        'Resource',
        'WebsocketService',
        'commentsCount',
        'flexibleRender',
        'referencesCount',
        'selectCommentsByReference',
        'withComments',
        'withReference'
      ])
    })
  })

  describe('ui', () => {
    test('should export right modules', () => {
      expect(Object.keys(ui).sort()).toEqual([
        'CommentsList',
        'CommentsListBase',
        'Icon',
        'NewCommentForm',
        'NewCommentFormBase',
        'Reference',
        'ReferenceBase',
        'Sidebar',
        'SidebarBase',
        'SidebarsController',
        'SidebarsControllerContext',
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
