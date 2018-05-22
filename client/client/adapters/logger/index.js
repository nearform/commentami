/* eslint-disable no-console */
const buildMessage = (message, tags = []) =>
  tags.length ? `[${tags.join(',')}] ${message}` : message

const logger = {
  info: ({ message, tags }) => {
    console.info(buildMessage(message, tags))
  },
  warn: ({ message, tags }) => {
    console.warn(buildMessage(message, tags))
  },
  error: ({ message, tags }) => {
    console.error(buildMessage(message, tags))
  },
  captureException: (error, errorInfo) => {
    console.error(error, { extra: errorInfo })
  }
}

export default logger
