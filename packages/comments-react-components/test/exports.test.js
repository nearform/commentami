import * as defaults from '../src/defaults'
import * as core from '../src/index'
import * as ui from '../src/ui'

describe('exports', () => {
  describe('core', () => {
    test('should export right modules', () => {
      expect(Object.keys(core).sort()).toEqual([
        'CommentableProvider',
        'CommentsFetchService',
        'CommentsNesService',
        'commentable',
        'commentableBlock',
        'flexibleRender'
      ])
    })
  })

  describe('ui', () => {
    test('should export right modules', () => {
      expect(Object.keys(ui)).toEqual([
        'CommentableBlock',
        'CommentableBlockBase',
        'CommentableCommentsList',
        'CommentableCommentsListBase',
        'CommentableController',
        'CommentableControllerContext',
        'commentableWithController',
        'CommentableIcon',
        'CommentableNewForm',
        'CommentableNewFormBase',
        'CommentableSidebar',
        'CommentableSidebarBase'
      ])
    })
  })

  describe('defaults', () => {
    test('should export right modules', () => {
      expect(Object.keys(defaults)).toEqual(['CommentableDefaultComment', 'CommentableDefaultMarker', 'CommentableDefaultSidebar'])
    })
  })
})
