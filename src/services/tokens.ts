import { Token, TokensResponse } from '@lifi/sdk'

/**
 * Parses given tokens from the API structure to the structure that is used by the application
 * @param tokens Tokens that should be parsed
 * @return List of parsed tokens
 */
export const parseTokensFromApi = (tokens: TokensResponse): Token[] => {
  const result: Token[] = []
  Object.values(tokens.tokens).forEach(item => {
    result.push(...item)
  })
  return result
}
