export const NUMBER_OF_GENERATIONS_TO_FETCH = 11

export const APP_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://hubdev.tools'

export const HREF_PREFIX = `${APP_URL}?ref=`

export const DEFAULT_BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg=='
