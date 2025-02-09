/**
 * Error class for API requests resulting in a 4xx or 5xx status code
 */
class ApiError extends Error {
  constructor (readonly url: string, readonly status: number) {
    super(`Erroneous request to endpoint ${url}, status ${status}`)
  }
}
/**
 * Checks the given response for errors and if an error exists then throws an error, otherwise
 * returns the given response
 * @param res Response that should be checked for errors
 * @throw The {@link ApiError} error is thrown if the request contains an error
 * @return Given response if no error exists
 */
const errorConverter = async (res: Response): Promise<Response> => {
  // Since there is no "real" API with some custom status code errors I consider that requests with
  // only status code >= 400 contain errors. With the "real" api it would be different
  if (res.status >= 400) {
    throw new ApiError(res.url, res.status)
  }
  return res
}

/**
 * Represents base fields that are required for all requests
 */
type SendBaseRequestParams = {
  /**
   * URL the request should be sent to
   * @example `https://blockstream.info/api/address/bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97`
   */
  url: string
}
/**
 * Represents params of sending the read request
 */
type SendReadRequestParams = SendBaseRequestParams & {
  /**
   * Method of the read request
   */
  method: 'GET'
}
/**
 * Represents params of sending the write request, means the request can make write operations
 */
type SendWriteRequestParams = SendBaseRequestParams & {
  /**
   * Method of the write request
   */
  method: 'POST' | 'PATCH'
  /**
   * Body of the write request. The key is a string, and it can be any needed value for the API.
   * Same with the value, the only difference is that the value can be any type
   * @default `undefined` which means there is no body used by default
   */
  body?: Record<string, unknown>
}
/**
 * Represents params of the request
 */
type SendRequestParams = SendReadRequestParams | SendWriteRequestParams
/**
 * Sends the request to the API based on the given data
 * @param params Params that should be used in the request
 * @return Result of the request
 */
export const sendRequest = <T>(params: SendRequestParams): Promise<T> => {
  const options: RequestInit = { method: params.method }
  // GET requests shouldn't have body, that's why we need to check that the body isn't added to
  // the request if it's a GET request
  if (params.method !== 'GET' && params.body) {
    options.body = JSON.stringify(params.body)
    // This header is required for the request with a body to tell the server that the body is
    // a json. Otherwise, the server won't parse the body correctly
    options.headers = { 'Content-Type': 'application/json' }
  }
  return fetch(params.url, options)
    .then(errorConverter)
    .then(res => res.json())
}
