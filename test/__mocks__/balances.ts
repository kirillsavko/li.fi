import { ChainId, CoinKey, TokenAmount } from '@lifi/sdk'

/** Just a mocked balance for tests */
export const mockBalance: TokenAmount = {
  chainId: ChainId.ETH,
  address: '0x0000000000000000000000000000000000000000',
  symbol: 'ETH',
  name: 'ETH',
  decimals: 18,
  priceUSD: '2728.99',
  coinKey: CoinKey.ETH,
  logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  amount: 10n,
}


