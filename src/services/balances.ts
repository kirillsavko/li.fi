import { TokenAmount } from '@lifi/sdk'
import Decimal from 'decimal.js'

/**
 * Gets from the given token its balance and parces the balance for UI to the human-readable format
 * @param token Token the balance should be gotten from
 * @return Human-readable token balance
 */
export const getTokenBalanceForUi = (token: TokenAmount): string => {
  const decimalBalance = new Decimal(token.amount?.toString() || 0)
  return decimalBalance.div(Decimal.pow(10, token.decimals)).toString()
}
