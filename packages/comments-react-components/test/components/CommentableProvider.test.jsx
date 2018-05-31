import React from 'react'
import { shallow } from 'enzyme'

import { CommentableProvider } from '../../src/components/CommentableProvider'
import { CommentsMockService } from '../helpers/CommentsMockService'

describe('CommentableBlockComponent', () => {
  let wrapper
  let service

  beforeEach(() => {
    service = new CommentsMockService()
    service.getComments.mockReturnValue([])
    wrapper = shallow(<CommentableProvider resource="page-1" service={service} />)
  })

  test('when the component is mounted it should refresh the comment list', async () => {
    expect(service.getComments).toHaveBeenCalledWith('page-1')
  })

  test('when the component is updated it should refresh the comment list', async () => {
    service.getComments.mockClear()
    wrapper.setProps({ resource: 'page-2' })
    expect(service.getComments).toHaveBeenCalledWith('page-2')
  })

  test("when the component is updated but the resource doesn't change it should not refresh the comment list", async () => {
    service.getComments.mockClear()
    wrapper.setProps({ anotherprop: 'some prop' })
    expect(service.getComments).not.toHaveBeenCalled()
  })

  test('call the removeComment should call the api', async () => {
    service.getComments.mockClear()
    wrapper.instance().removeComment('comm-1')
    expect(service.removeComment).toHaveBeenCalledWith('comm-1')
  })

  test('call the addComment should call the api', async () => {
    service.getComments.mockClear()
    wrapper.instance().addComment('block-1', 'somecontent')
    expect(service.addComment).toHaveBeenCalledWith({
      content: 'somecontent',
      reference: 'block-1',
      resource: 'page-1'
    })
  })
})
