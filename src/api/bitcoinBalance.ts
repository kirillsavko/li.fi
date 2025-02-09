import { sendRequest } from './index.ts'

const blockStreamApi = 'https://blockstream.info/api/address/'

/** Represents the structure of Bitcoin address balance data returned by Blockstream API */
export type BitcoinTokenAmount = {
  /** The Bitcoin address for which balance data is retrieved */
  address: string
  /** Statistics of the address based on confirmed transactions (included in blocks) */
  chain_stats: ChainStats
  /** Statistics of the address based on unconfirmed transactions (in the mempool) */
  mempool_stats: MempoolStats
}

/** Represents statistics of a Bitcoin address based on confirmed transactions */
type ChainStats = {
  /** Total amount of satoshis received by this address */
  funded_txo_sum: number
  /** Total amount of satoshis spent from this address */
  spent_txo_sum: number
  /** The total number of confirmed transactions associated with this address */
  tx_count: number
}

/** Represents statistics of a Bitcoin address based on unconfirmed transactions */
type MempoolStats = {
  /** Total amount of satoshis received by this address that are not yet confirmed */
  funded_txo_sum: number
  /** Total amount of satoshis spent from this address that are not yet confirmed */
  spent_txo_sum: number
  /** The total number of unconfirmed transactions associated with this address */
  tx_count: number
}

/**
 * Returns bitcoin balance by the given bitcoin address
 * @param walletAddress Bitcoin address the balance should be got for
 * @return Bitcoin balance data for the passed address
 */
export const getBitcoinBalanceByAddress = (walletAddress: string): Promise<BitcoinTokenAmount> => {
  return sendRequest({ url: `${blockStreamApi}/${walletAddress}`, method: 'GET' })
}
