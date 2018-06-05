// TODO@PI: Fix coverage report
import * as core from '../src/index'
import * as ui from '../src/ui'

describe('exports', () => {
  describe('core', () => {
    test('should export right modules', () => {
      expect(Object.keys(core)).toEqual(['CommentableComponent', 'CommentableBlock', 'CommentableProvider', 'CommentsFetchService'])
    })
  })

  describe('ui', () => {
    test('should export right modules', () => {
      expect(Object.keys(ui)).toEqual([
        'CommentableSidebarsContainer',
        'CommentableSidebarsContext',
        'CommentableSidebar',
        'CommentableNewForm',
        'CommentableCommentsList',
        'CommentableComment',
        'CommentableIcon'
      ])
    })
  })
})
