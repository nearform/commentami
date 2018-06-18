/**
 * The state object
 * @typedef {Object} State
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
 * Begin the initialization phase
 * @param {State} state
 * @returns {State}
 */
export const initialize = state => Object.assign({}, state, { isInit: false, initError: null })

/**
 * Set the initialization success result
 * @param {State} state
 * @returns {State}
 */
export const initializeSuccess = state => Object.assign({}, state, { isInit: true })

/**
 * Set the initialization error result
 *
 * @param {State} state
 * @param {object} error
 * @returns {State}
 */
export const initializeFail = (state, error) => Object.assign({}, state, { isInit: false, initError: error })

/**
 * Init the fetching phase
 *
 * @param {State} state
 * @returns {State}
 */
export const fetching = state => Object.assign({}, state, { isFetching: true, fetchError: null })

/**
 * Set the fetching success
 *
 * @param {State} state
 * @returns {State}
 */
export const fetchingSuccess = state => Object.assign({}, state, { isFetching: false })

/**
 * Set the fetching error
 *
 * @param {State} state
 * @param {object} error
 * @returns {State}
 */
export const fetchingFail = (state, error) => Object.assign({}, state, { isFetching: false, fetchError: error })

/**
 * Init the updating phase
 *
 * @param {State} state
 * @returns {State}
 */
export const updating = state => Object.assign({}, state, { isUpdating: true, updateError: null })

/**
 * Set the updating success
 *
 * @param {State} state
 * @returns {State}
 */
export const updatingSuccess = state => Object.assign({}, state, { isUpdating: false })

/**
 * Set the updating error
 *
 * @param {State} state
 * @param {object} error
 * @returns {State}
 */
export const updatingFail = (state, error) => Object.assign({}, state, { isUpdating: false, updateError: error })
