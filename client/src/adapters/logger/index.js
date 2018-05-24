/* eslint-disable no-console */

const logger = {
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
  captureException: (error, errorInfo) => {
    console.error(error, { extra: errorInfo })
  }
}

export default logger
