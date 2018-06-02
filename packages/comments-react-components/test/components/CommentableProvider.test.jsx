import React from 'react'
import { shallow } from 'enzyme'

import { CommentableProvider } from '../../src/components/CommentableProvider'
import { CommentsMockService } from '../helpers/CommentsMockService'

describe('CommentableProvider', () => {
  let wrapper
  let service

  beforeEach(() => {
    service = new CommentsMockService()
    service.getComments.mockReturnValue([])
    wrapper = shallow(<CommentableProvider resource="res-1" service={service}/>)
  })

  test('when the component is mounted it should refresh the comment list', async () => {
    expect(service.getComments).toHaveBeenCalledWith({ id: 'res-1' })
  })

  test('when the component is updated it should refresh the comment list', async () => {
    service.getComments.mockClear()
    wrapper.setProps({ resource: 'res-2' })
    expect(service.getComments).toHaveBeenCalledWith({ id: 'res-2' })
  })

  test("when the component is updated but the resource doesn't change it should not refresh the comment list", async () => {
    service.getComments.mockClear()
    wrapper.setProps({ anotherprop: 'some prop' })
    expect(service.getComments).not.toHaveBeenCalled()
  })

  test('call the removeComment should call the api', async () => {
    service.getComments.mockClear()
    wrapper.instance().removeComment({
      id: 1,
      resource: 'res-1',
      reference: 'ref-2'
    })

    expect(service.removeComment).toHaveBeenCalledWith({
      id: 1,
      resource: 'res-1',
      reference: 'ref-2'
    })
  })

  test('call the addComment should call the api', async () => {
    service.getComments.mockClear()
    service.addComment.mockReturnValue({
      id: 1,
      resource: 'res-1',
      reference: 'ref-2',
      content: 'somecontent'
    })

    wrapper.instance().addComment('ref-2', 'somecontent')

    expect(service.addComment).toHaveBeenCalledWith({
      author: undefined,
      content: 'somecontent',
      id: undefined,
      reference: 'ref-2',
      resource: { id: 'res-1' }
    })
  })
})
