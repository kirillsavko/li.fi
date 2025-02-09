import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { ChainType, getTokenBalances, Token, TokenAmount } from '@lifi/sdk'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAccount } from 'wagmi'

import { useGlobalErrors } from './GlobalErrorsContext.tsx'
import { useTokens } from './TokensContext.tsx'
import { useBitcoinWallet } from './BitcoinWalletContext.tsx'
import { BitcoinTokenAmount, getBitcoinBalanceByAddress } from '../api/bitcoinBalance.ts'

/**
 * Represents structure of the balances context
 */
type Context = {
  /**
   * List of all EVM balances for the user's account. If account isn't connected then just
   * an empty array
   */
  evmBalances: Token[]
  /**
   * Indicates if EVM balances are being fetched
   */
  fetchingEvmBalances: boolean
  /**
   * List of all Solana balances for the user's account. If account isn't connected then just
   * an empty array
   */
  solanaBalances: Token[]
  /**
   * Indicates if Solana balances are being fetched
   */
  fetchingSolanaBalances: boolean
  /**
   * List of all Bitcoin balances for the user's account. If account isn't connected then just
   * an empty array
   */
  bitcoinBalances: BitcoinTokenAmount[]
  /**
   * Indicates if Bitcoin balances are being fetched
   */
  fetchingBitcoinBalances: boolean
}

/**
 * Created balances context with the initial value
 */
const BalancesContext = createContext<Context | null>(null)

/**
 * Balances provider that contains logic of the whole balances store
 */
export const BalancesProvider: FC<PropsWithChildren> = props => {
  const globalErrorsHook = useGlobalErrors()
  const { publicKey: solanaAccountAddress } = useWallet();
  const { address: evmAccountAddress } = useAccount()
  const tokensHook = useTokens()
  const bitcoinHook = useBitcoinWallet()
  const bitcoinAccount = bitcoinHook.user.isUserSignedIn()
    ? bitcoinHook.user.loadUserData().profile.btcAddress.p2wpkh.mainnet
    : undefined

  const [evmBalances, setEvmBalances] = useState<TokenAmount[]>([])
  const [fetchingEvmBalances, setFetchingEvmBalances] = useState(false)
  const [solanaBalances, setSolanaBalances] = useState<TokenAmount[]>([])
  const [fetchingSolanaBalances, setFetchingSolanaBalances] = useState(false)
  const [bitcoinBalances, setBitcoinBalances] = useState<BitcoinTokenAmount[]>([])
  const [fetchingBitcoinBalances, setFetchingBitcoinBalances] = useState(false)

  const fetchBalances = (
    walletAddress: string, tokens: Token[], chain: ChainType.EVM | ChainType.SVM,
  ) => {
    let setFetchingFlagFunction: (newValue: boolean) => void
    let setBalancesFunction: (newValue: TokenAmount[]) => void

    if (chain === ChainType.EVM) {
      setFetchingFlagFunction = setFetchingEvmBalances
      setBalancesFunction = setEvmBalances
    } else if (chain === ChainType.SVM) {
      setFetchingFlagFunction = setFetchingSolanaBalances
      setBalancesFunction = setSolanaBalances
    }

    setFetchingFlagFunction(true)
    getTokenBalances(walletAddress, tokens)
      .then(setBalancesFunction)
      .catch(e => {
        // Ideally, all errors from the API should be caught here and based on the response status
        // code different error messages shown, but to save some time I won't do this. I believe
        // it can be skipped so far for the test application, but for the production one it's
        // really important and shouldn't be skipped
        globalErrorsHook.addError(`Unexpected error during fetching ${chain} balances: ${e}`)
      })
      .finally(() => setFetchingFlagFunction(false))
  }

  const fetchBitcoinBalance = (walletAddress: string) => {
    setFetchingBitcoinBalances(true)
    getBitcoinBalanceByAddress(walletAddress)
      .then(token => {
        setBitcoinBalances([token])
      })
      .catch(e => {
        globalErrorsHook.addError(`Unexpected error during fetching bitcoin balances: ${e}`)
      })
      .finally(() => setFetchingBitcoinBalances(false))
  }

  /** Gets EVM balances when the user connected the wallet and if tokens presented */
  useEffect(() => {
    if (tokensHook.evmTokens.length > 0) {
      if (evmAccountAddress) {
        fetchBalances(evmAccountAddress, tokensHook.evmTokens, ChainType.EVM)
      } else {
        setEvmBalances([])
      }
    }
  }, [evmAccountAddress, tokensHook.evmTokens])

  /** Gets Solana balances when the user connected the wallet and if tokens presented */
  useEffect(() => {
    if (tokensHook.solanaTokens.length > 0) {
      if (solanaAccountAddress) {
        fetchBalances(solanaAccountAddress.toString(), tokensHook.solanaTokens, ChainType.SVM)
      } else {
        setSolanaBalances([])
      }
    }
  }, [solanaAccountAddress, tokensHook.solanaTokens])

  /** Gets Bitcoin balances when the user connected the wallet and if tokens presented */
  useEffect(() => {
    if (tokensHook.bitcoinTokens.length > 0) {
      if (bitcoinAccount) {
        // Unfortunately, the LI.FI SDK doesn't provide a solution for getting bitcoin token balance.
        // That's why another logic is used here
        fetchBitcoinBalance(bitcoinAccount)
      } else {
        setBitcoinBalances([])
      }
    }
  }, [bitcoinAccount, tokensHook.bitcoinTokens])

  return (
    <BalancesContext.Provider value={{
      evmBalances, fetchingEvmBalances, solanaBalances, fetchingSolanaBalances, bitcoinBalances,
      fetchingBitcoinBalances,
    }}>
      {props.children}
    </BalancesContext.Provider>
  )
}

/**
 * Hook for using the balances store. The hook can be used in any component of the application to
 * access the store
 */
export const useBalances = () => {
  const context = useContext(BalancesContext)
  if (!context) {
    throw new Error('useBalances must be used within a BalancesProvider')
  }
  return context
}

