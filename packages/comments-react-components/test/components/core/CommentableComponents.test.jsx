import { mount } from 'enzyme'
import React from 'react'
import { commentable, commentableBlock, flexibleRender } from '../../../src/components/core/CommentableComponents'
import { CommentableContext } from '../../../src/components/core/CommentableProvider'

function PropsChildren({ resource, reference }) {
  return (
    <span>
      {resource}--{reference}
    </span>
  )
}

function Children({ commentable, resource }) {
  return <span>1</span>
}

describe('flexibleRender', () => {
  test('should render using the render method', () => {
    const wrapper = mount(flexibleRender({ render: () => <h1>ok</h1>, component: PropsChildren }, { reference: 'REFERENCE', resource: 'RESOURCE' }))

    expect(wrapper.contains(<h1>ok</h1>)).toBeTruthy()
  })

  test('should render the provided component', () => {
    const wrapper = mount(flexibleRender({ component: PropsChildren }, { reference: 'REFERENCE', resource: 'RESOURCE' }))

    expect(wrapper.contains(<span>RESOURCE--REFERENCE</span>)).toBeTruthy()
  })

  test('should render using a default component', () => {
    const wrapper = mount(flexibleRender({}, { reference: 'REFERENCE', resource: 'RESOURCE' }, PropsChildren))

    expect(wrapper.contains(<span>RESOURCE--REFERENCE</span>)).toBeTruthy()
  })

  test('should children otherwise', () => {
    const wrapper = mount(flexibleRender({ children: <h1>ok</h1> }))

    expect(wrapper.contains(<h1>ok</h1>)).toBeTruthy()
  })
})

describe('commentable', () => {
  test('should warn if included outside of a context', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    const CommentableComponent = commentable(Children)

    const wrapper = mount(
      <CommentableContext.Provider>
        <CommentableComponent />
      </CommentableContext.Provider>
    )

    wrapper.setProps({ a: 1 })

    expect(errorSpy).toHaveBeenCalledWith('Warning: The commentable component should be inside a CommentableProvider')
    expect(errorSpy).toHaveBeenCalledTimes(2)
  })

  describe('.render', () => {
    test('should render the providen component with the right properties', () => {
      const context = { reference: 'REFERENCE', resource: 'RESOURCE' }
      const CommentableComponent = commentable(PropsChildren)

      const wrapper = mount(
        <CommentableContext.Provider value={context}>
          <CommentableComponent />
        </CommentableContext.Provider>
      )

      expect(wrapper.contains(<span>RESOURCE--</span>)).toBeTruthy()
    })

    test('should declare no comments by default', () => {
      const CommentableComponent = commentable(Children)

      const wrapper = mount(
        <CommentableContext.Provider>
          <CommentableComponent reference="REFERENCE" />
        </CommentableContext.Provider>
      )

      expect(
        wrapper
          .find(Children)
          .first()
          .prop('hasComments')
      ).toBeFalsy()
    })

    test('should declare comments if they are present', () => {
      const context = { commentsState: { references: { REFERENCE: { comments: [{ reference: { id: 'REFERENCE' } }] } } } }
      const CommentableComponent = commentable(Children)

      const wrapper = mount(
        <CommentableContext.Provider value={context}>
          <CommentableComponent reference="REFERENCE" />
        </CommentableContext.Provider>
      )

      expect(
        wrapper
          .find(Children)
          .first()
          .prop('hasComments')
      ).toBeTruthy()
    })
  })

  describe('.addComment', () => {
    test('should call the context implementation', async () => {
      const commentableContext = { addComment: jest.fn(), removeComment: jest.fn() }
      const CommentableComponent = commentable(Children)

      const instance = mount(
        <CommentableContext.Provider value={commentableContext}>
          <CommentableComponent component={Children} />
        </CommentableContext.Provider>
      ).instance()

      await instance.addComment('REFERENCE', 'COMMENT')
      expect(commentableContext.addComment).toHaveBeenCalledWith('REFERENCE', 'COMMENT')
    })
  })

  describe('.removeComment', () => {
    test('should call the context implementation', async () => {
      const commentableContext = { addComment: jest.fn(), removeComment: jest.fn() }
      const CommentableComponent = commentable(Children)

      const instance = mount(
        <CommentableContext.Provider value={commentableContext}>
          <CommentableComponent component={Children} />
        </CommentableContext.Provider>
      ).instance()

      await instance.removeComment('COMMENT')
      expect(commentableContext.removeComment).toHaveBeenCalledWith('COMMENT')
    })
  })
})

describe('commentableBlock', () => {
  test('should warn if included outside of a context and without a context', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    const CommentableComponent = commentableBlock(Children)

    const wrapper = mount(<CommentableComponent />)

    wrapper.setProps({ a: 1 })

    expect(errorSpy).toHaveBeenCalledWith('Warning: The commentable component should be inside a CommentableProvider')
    expect(errorSpy).toHaveBeenCalledWith('Warning: The commentable block component should have a reference prop')
  })
})
