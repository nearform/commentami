/**
 * The state object
 * @typedef {Object} Resource
 * @property {string} id - The resource identifier
 * @property {Object.<string, Reference>} references - The references stored in the resource
 * @property {boolean} isInit - Identify if the state is initialized
 * @property {null|Object} initError - The initialization error
 * @property {boolean} isFetching - Identify if the state is fetching data
 * @property {null|Object} fetchError - The fetching error
 * @property {boolean} isUpdating - Identify if the state is updating
 * @property {null|Object} updateError - The updating error
 */

/**
 * A timestamp.
 * @typedef {(number)} Timestamp
 */

export const initialize = state => Object.assign({}, state, { isInit: false, initError: null })
export const initializeSuccess = state => Object.assign({}, state, { isInit: true })
export const initializeFail = (state, error) => Object.assign({}, state, { isInit: false, initError: error })

export const fetching = state => Object.assign({}, state, { isFetching: true, fetchError: null })
export const fetchingSuccess = state => Object.assign({}, state, { isFetching: false })
export const fetchingFail = (state, error) => Object.assign({}, state, { isFetching: false, fetchError: error })

export const updating = state => Object.assign({}, state, { isUpdating: true, updateError: null })
export const updatingSuccess = state => Object.assign({}, state, { isUpdating: false })
export const updatingFail = (state, error) => Object.assign({}, state, { isUpdating: false, updateError: error })
