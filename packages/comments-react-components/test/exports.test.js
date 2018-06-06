import * as core from '../src/index'
import * as ui from '../src/ui'
import * as defaults from '../src/defaults'

describe('exports', () => {
  describe('core', () => {
    test('should export right modules', () => {
      expect(Object.keys(core).sort()).toEqual(['CommentableProvider', 'CommentsFetchService', 'commentable', 'commentableBlock', 'flexibleRender'])
    })
  })

  describe('ui', () => {
    test('should export right modules', () => {
      expect(Object.keys(ui)).toEqual([
        'CommentableBlock',
        'CommentableBlockBase',
        'CommentableCommentsList',
        'CommentableCommentsListBase',
        'CommentableControllerContext',
        'CommentableController',
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
    test.only('should export right modules', () => {
      expect(Object.keys(defaults)).toEqual(['CommentableDefaultComment', 'CommentableDefaultMarker', 'CommentableDefaultSidebar'])
    })
  })
})
