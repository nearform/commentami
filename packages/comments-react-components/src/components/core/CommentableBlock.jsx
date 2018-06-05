import { commentsCount } from '../../state/selectors'
import { CommentableComponent } from './CommentableComponent'

export class CommentableBlock extends CommentableComponent {
  get renderProps() {
    const hasComments = this.hasCommentable && !!commentsCount(this.commentable, { id: this.props.reference })

    return { ...this.props, hasComments }
  }
}
