import {
  fetching,
  fetchingFail,
  fetchingSuccess,
  initialize,
  initializeFail,
  initializeSuccess,
  updating,
  updatingFail,
  updatingSuccess
} from '../../../src/state/reducers'
import { getDefaultState } from '../../../src/state/helpers/getters'

describe('state/reducers', () => {
  test('Init the state', () => {
    expect(getDefaultState('res-1')).toEqual({
      fetchError: null,
      id: 'res-1',
      initError: null,
      isFetching: false,
      isInit: false,
      isUpdating: false,
      references: {},
      updateError: null
    })
  })

  describe('initialize', () => {
    test('begin initialize should set the right values', () => {
      expect(initialize({})).toEqual({ initError: null, isInit: false })
    })

    test('intializeSuccess should set isInit to true', () => {
      expect(initializeSuccess({ initError: null, isInit: false })).toEqual({ initError: null, isInit: true })
    })

    test('intializeFail should set isInit to false and the error value', () => {
      expect(initializeFail({ initError: null, isInit: false }, 'some error')).toEqual({
        initError: 'some error',
        isInit: true
      })
    })
  })

  describe('fetching', () => {
    test('begin fetching should set the right values', () => {
      expect(fetching({})).toEqual({ fetchError: null, isFetching: true })
    })

    test('intializeSuccess should set isFetching to true', () => {
      expect(fetchingSuccess({ fetchError: null, isFetching: true })).toEqual({ fetchError: null, isFetching: false })
    })

    test('intializeFail should set isFetching to false and the error value', () => {
      expect(fetchingFail({ fetchError: null, isFetching: true }, 'some error')).toEqual({
        fetchError: 'some error',
        isFetching: false
      })
    })
  })

  describe('updating', () => {
    test('begin updating should set the right values', () => {
      expect(updating({})).toEqual({ updateError: null, isUpdating: true })
    })

    test('intializeSuccess should set isUpdating to true', () => {
      expect(updatingSuccess({ updateError: null, isUpdating: true })).toEqual({ updateError: null, isUpdating: false })
    })

    test('intializeFail should set isUpdating to false and the error value', () => {
      expect(updatingFail({ updateError: null, isUpdating: true }, 'some error')).toEqual({
        updateError: 'some error',
        isUpdating: false
      })
    })
  })
})
