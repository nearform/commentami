import { shallow } from 'enzyme'
import React from 'react'
import { CommentableProvider } from '../../../src/components/core/CommentableProvider'
import { CommentsMockService } from '../../helpers/CommentsMockService'

describe('CommentableProvider', () => {
  let wrapper
  let service

  beforeEach(() => {
    service = new CommentsMockService()
    service.getComments.mockReturnValue([])
    wrapper = shallow(<CommentableProvider resource="page-1" service={service} />)
  })

  describe('lifecycle', () => {
    test('when the component is mounted it should refresh the comment list', async () => {
      expect(service.getComments).toHaveBeenCalledWith('page-1')
      wrapper.unmount()
    })

    test('when the component is updated it should refresh the comment list', async () => {
      service.getComments.mockClear()
      wrapper.setProps({ resource: 'page-2' })
      expect(service.getComments).toHaveBeenCalledWith('page-2')
    })

    test('when the component is updated without resource change it should not refresh the comment list', async () => {
      service.getComments.mockClear()
      wrapper.setProps({ anotherprop: 'some prop' })
      expect(service.getComments).not.toHaveBeenCalled()
    })
  })

  describe('.addComment', () => {
    test('should call the API', async () => {
      service.getComments.mockClear()
      wrapper.instance().addComment('block-1', 'somecontent')
      expect(service.addComment).toHaveBeenCalledWith('page-1', {
        resource: 'page-1',
        reference: { id: 'block-1' },
        content: 'somecontent'
      })
    })

    test('should log API exceptions', async () => {
      const error = new Error('FAILED')
      const instance = wrapper.instance()
      const apiSpy = jest.spyOn(instance.commentsState, 'addComment').mockRejectedValue(error)
      const logSpy = jest.spyOn(instance.logger, 'error').mockImplementation(() => null)

      await instance.addComment('block-1', 'somecontent')
      expect(logSpy).toHaveBeenCalledWith(error)

      logSpy.mockRestore()
      apiSpy.mockRestore()
    })
  })

  describe('.removeComment', () => {
    test('should call the API', async () => {
      service.getComments.mockClear()
      wrapper.instance().removeComment('comm-1')
      expect(service.removeComment).toHaveBeenCalledWith('comm-1')
    })

    test('should log exceptions', async () => {
      const error = new Error('FAILED')
      const instance = wrapper.instance()
      const apiSpy = jest.spyOn(instance.commentsState, 'removeComment').mockRejectedValue(error)
      const logSpy = jest.spyOn(instance.logger, 'error').mockImplementation(() => null)

      await instance.removeComment('block-1', 'somecontent')
      expect(logSpy).toHaveBeenCalledWith(error)

      logSpy.mockRestore()
      apiSpy.mockRestore()
    })
  })
})
