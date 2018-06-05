import { mount } from 'enzyme'
import React from 'react'
import { getComponentWithContext } from '../../helpers/context'

function PropsChildren({ commentable, resource }) {
  return (
    <span>
      {commentable.addComment}--{resource}
    </span>
  )
}

function Children({ commentable, resource }) {
  return <span>1</span>
}

function AnotherChildren() {
  return <span>2</span>
}

function createComponent(context) {
  return getComponentWithContext(
    'CommentableComponent',
    context,
    'CommentableContext',
    require.resolve('../../../src/components/core/CommentableComponent'),
    require.resolve('../../../src/components/core/CommentableProvider')
  )
}

describe('CommentableComponent', () => {
  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
  })

  test('should warn if included outside of a context', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    const CommentableComponent = createComponent(undefined)

    mount(<CommentableComponent />)

    expect(errorSpy).toHaveBeenCalledWith('Warning: The CommentableComponent component should be inside a CommentableProvider')
  })

  describe('.render', () => {
    test('should render the providen component with the right properties', () => {
      const CommentableComponent = createComponent({ addComment: 'ADD-COMMENT', resource: 'RESOURCE' })
      const wrapper = mount(<CommentableComponent component={PropsChildren} />)

      expect(wrapper.contains(<span>ADD-COMMENT--RESOURCE</span>)).toBeTruthy()
    })

    test('should render using the render property and ignoring the component', () => {
      const CommentableComponent = createComponent({})
      const wrapper = mount(<CommentableComponent component={Children} render={props => <AnotherChildren {...props} />} />)

      expect(wrapper.contains(<span>2</span>)).toBeTruthy()
    })

    test('should render children if nothing else is provided', () => {
      const CommentableComponent = createComponent({})
      const wrapper = mount(
        <CommentableComponent>
          <span>3</span>
        </CommentableComponent>
      )

      expect(wrapper.contains(<span>3</span>)).toBeTruthy()
    })

    test('should not fail if thing is provided', () => {
      const CommentableComponent = createComponent({})
      const wrapper = mount(<CommentableComponent />)

      expect(wrapper.html()).toBe(null)
    })
  })

  describe('.addComment', () => {
    test('should call the context implementation', async () => {
      const commentable = { addComment: jest.fn(), removeComment: jest.fn() }
      const CommentableComponent = createComponent(commentable)
      const instance = mount(<CommentableComponent component={Children} />).instance()

      await instance.addComment('COMMENT', 'REFERENCE')
      expect(commentable.addComment).toHaveBeenCalledWith('COMMENT', 'REFERENCE')
    })
  })

  describe('.removeComment', () => {
    test('should call the context implementation', async () => {
      const commentable = { addComment: jest.fn(), removeComment: jest.fn() }
      const CommentableComponent = createComponent(commentable)
      const instance = mount(<CommentableComponent component={Children} />).instance()

      await instance.removeComment('COMMENT')
      expect(commentable.removeComment).toHaveBeenCalledWith('COMMENT')
    })
  })
})
