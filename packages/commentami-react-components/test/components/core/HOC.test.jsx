import { mount } from 'enzyme'
import React from 'react'
import { withResource, withReference, flexibleRender } from '../../../src/components/core/HOC'
import { ResourceContext } from '../../../src/components/core/Resource'
import { getDefaultResourceContext } from '../../helpers/context'
import { createComment } from '../../../src/state/helpers/creators'
import { getDefaultState } from '../../../src/state/helpers/getters'
import { setCommentToResource } from '../../../src/state/reducers/resource'

function PropsChildren({ commentami: { resource, reference } }) {
  return (
    <span>
      {resource}
      --
      {reference}
    </span>
  )
}

function Children({ withResource, resource }) {
  return <span>1</span>
}

describe('flexibleRender', () => {
  test('should render using the render method', () => {
    const wrapper = mount(
      flexibleRender(
        { render: () => <h1>ok</h1>, component: PropsChildren },
        { reference: 'REFERENCE', resource: 'RESOURCE' }
      )
    )

    expect(wrapper.contains(<h1>ok</h1>)).toBeTruthy()
  })

  test('should render the provided component', () => {
    const wrapper = mount(
      flexibleRender({ component: PropsChildren }, { commentami: { reference: 'REFERENCE', resource: 'RESOURCE' } })
    )

    expect(wrapper.contains(<span>RESOURCE--REFERENCE</span>)).toBeTruthy()
  })

  test('should render using a default component', () => {
    const wrapper = mount(
      flexibleRender(
        {},
        {
          commentami: {
            reference: 'REFERENCE',
            resource: 'RESOURCE'
          }
        },
        PropsChildren
      )
    )

    expect(wrapper.contains(<span>RESOURCE--REFERENCE</span>)).toBeTruthy()
  })

  test('should children otherwise', () => {
    const wrapper = mount(flexibleRender({ children: <h1>ok</h1> }))

    expect(wrapper.contains(<h1>ok</h1>)).toBeTruthy()
  })
})

describe('withResource', () => {
  test('should warn if included outside of a context', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    const CommentableComponent = withResource(Children)

    const wrapper = mount(
      <ResourceContext.Provider>
        <CommentableComponent />
      </ResourceContext.Provider>
    )

    wrapper.setProps({ a: 1 })

    expect(errorSpy).toHaveBeenCalledWith('Warning: The commentable component should be inside a Resource')
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })

  describe('.render', () => {
    test('should render the providen component with the right properties', () => {
      const context = { reference: 'REFERENCE', resource: 'RESOURCE' }
      const CommentableComponent = withResource(PropsChildren)

      const wrapper = mount(
        <ResourceContext.Provider value={context}>
          <CommentableComponent />
        </ResourceContext.Provider>
      )

      expect(wrapper.contains(<span>RESOURCE--</span>)).toBeTruthy()
    })
  })
})

describe('withReference', () => {
  describe('.render', () => {
    test('should warn if included outside of a context and without a context', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation()
      const CommentableComponent = withReference(Children)

      const wrapper = mount(<CommentableComponent />)

      wrapper.setProps({ a: 1 })

      expect(errorSpy).toHaveBeenCalledWith('Warning: The commentable component should be inside a Resource')
      expect(errorSpy).toHaveBeenCalledWith('Warning: The commentable block component should have a reference prop')
    })

    test('should declare no comments by default', () => {
      const CommentableComponent = withReference(Children)

      const wrapper = mount(
        <ResourceContext.Provider>
          <CommentableComponent reference="REFERENCE" />
        </ResourceContext.Provider>
      )

      expect(
        wrapper
          .find(Children)
          .first()
          .prop('hasComments')
      ).toBeFalsy()
    })

    test('should declare comments if they are present', () => {
      const context = getDefaultResourceContext({
        commentsState: setCommentToResource(
          getDefaultState('RESOURCE'),
          { id: 'REFERENCE' },
          createComment({
            reference: { id: 'REFERENCE' },
            id: 'comm-1',
            content: 'AAA'
          })
        )
      })

      const CommentableComponent = withReference(Children)

      const wrapper = mount(
        <ResourceContext.Provider value={context}>
          <CommentableComponent reference="REFERENCE" />
        </ResourceContext.Provider>
      )

      expect(
        wrapper
          .find(Children)
          .first()
          .prop('commentami').hasComments
      ).toBeTruthy()
    })
  })

  describe('.addComment', () => {
    test('should call the context implementation', async () => {
      const commentableContext = {
        addComment: jest.fn(),
        removeComment: jest.fn()
      }
      const CommentableComponent = withReference(Children)

      const instance = mount(
        <ResourceContext.Provider value={commentableContext}>
          <CommentableComponent component={Children} />
        </ResourceContext.Provider>
      )
        .find(CommentableComponent)
        .first()
        .children()
        .first()
        .instance()

      await instance.addComment('REFERENCE', 'COMMENT')
      expect(commentableContext.addComment).toHaveBeenCalledWith('REFERENCE', 'COMMENT')
    })
  })

  describe('.removeComment', () => {
    test('should call the context implementation', async () => {
      const commentableContext = {
        addComment: jest.fn(),
        removeComment: jest.fn()
      }
      const CommentableComponent = withReference(Children)

      const instance = mount(
        <ResourceContext.Provider value={commentableContext}>
          <CommentableComponent component={Children} />
        </ResourceContext.Provider>
      )
        .find(CommentableComponent)
        .first()
        .children()
        .first()
        .instance()

      await instance.removeComment('COMMENT')
      expect(commentableContext.removeComment).toHaveBeenCalledWith('COMMENT')
    })
  })
})
