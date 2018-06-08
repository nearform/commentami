import * as defaults from '../src/defaults'
import * as core from '../src/index'
import * as ui from '../src/ui'

describe('exports', () => {
  describe('core', () => {
    test('should export right modules', () => {
      expect(Object.keys(core).sort()).toEqual([
        'CommentsFetchService',
        'CommentsNesService',
        'Resource',
        'commentable',
        'commentableBlock',
        'commentsCount',
        'flexibleRender',
        'referencesCount',
        'selectCommentsByReference'
      ])
    })
  })

  describe('ui', () => {
    test('should export right modules', () => {
      expect(Object.keys(ui)).toEqual([
        'Reference',
        'ReferenceBase',
        'CommentsList',
        'CommentsListBase',
        'SidebarsController',
        'SidebarsControllerContext',
        'commentableWithController',
        'Icon',
        'NewCommentForm',
        'NewCommentFormBase',
        'Sidebar',
        'SidebarBase'
      ])
    })
  })

  describe('defaults', () => {
    test('should export right modules', () => {
      expect(Object.keys(defaults)).toEqual(['DefaultComment', 'DefaultMarker', 'DefaultSidebar'])
    })
  })
})
