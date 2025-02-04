import { sendRequest } from './index'

/**
 * Represents a cryptocurrency token supported by the LI.FI API
 */
export type Token = {
  /**
   * The symbol of the token
   * @example "ETH", "USDT"
   */
  symbol: string
  /**
   * The full name of the token
   * @example "Ethereum", "Tether USD"
   */
  name: string
  /**
   * The contract address of the token on the corresponding blockchain
   */
  address: string
  /**
   * The unique identifier of the blockchain where the token exists
   */
  chainId: number
  /**
   * A URL pointing to the token's logo image. The field is optional
   */
  logoURI?: string
}

/**
 * Gets the list of all tokens and returns it
 * @return List of all tokens
 */
export const getTokens = (): Promise<Token[]> => {
  // TODO: Add support for needed chainTypes
  return sendRequest({ method: 'GET', route: `/tokens` })
    .then(res => {
      // By default, API returns all tokens as arrays of objects. It's not convenient to use
      // in the application, so we parse it to have just an array of all tokens
      const result = []
      Object.values(res.tokens).forEach(item => {
        result.push(...item)
      })
      return result
    })
}
