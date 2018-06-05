import { selectCommentsByReference } from '../../state/selectors'
import { CommentableComponent } from './CommentableComponent'

export class CommentableBlock extends CommentableComponent {
  get renderProps() {
    const hasComments = this.hasCommentable && !!selectCommentsByReference(this.commentable, this.props.reference).length

    return { ...this.props, hasComments }
  }
}
