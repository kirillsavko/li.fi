import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { ChainType, getTokenBalances, Token, TokenAmount } from '@lifi/sdk'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAccount } from 'wagmi'

import { useGlobalErrors } from './GlobalErrorsContext.tsx'
import { useTokens } from './TokensContext.tsx'

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
}

/**
 * Created balances context with the initial value
 */
const Context = createContext<Context | null>(null)

/**
 * Balances provider that contains logic of the whole balances store
 */
export const BalancesProvider: FC<PropsWithChildren> = props => {
  const globalErrorsHook = useGlobalErrors()
  const { publicKey: solanaAccountAddress } = useWallet();
  const { address: evmAccountAddress } = useAccount()
  const tokensHook = useTokens()

  const [evmBalances, setEvmBalances] = useState<Token[]>([])
  const [fetchingEvmBalances, setFetchingEvmBalances] = useState(false)
  const [solanaBalances, setSolanaBalances] = useState<Token[]>([])
  const [fetchingSolanaBalances, setFetchingSolanaBalances] = useState(false)

  const fetchBalances = (
    walletAddress: string, tokens: Token[], chain: ChainType.EVM | ChainType.SVM,
  ) => {
    let setFetchingFlagFunction: (newValue: boolean) => void
    let setBalancesFunction: (newValue: TokenAmount[]) => void

    if (chain === ChainType.EVM) {
      setFetchingFlagFunction = setFetchingEvmBalances
      setBalancesFunction = setEvmBalances
    } else {
      setFetchingFlagFunction = setFetchingSolanaBalances
      setBalancesFunction = setSolanaBalances
    }

    setFetchingFlagFunction(true)
    getTokenBalances(walletAddress, tokens)
      .then(setBalancesFunction)
      .catch(() => {
        // Ideally, all errors from the API should be caught here and based on the response status
        // code different error messages shown, but to save some time I won't do this. I believe
        // it can be skipped so far for the test application, but for the production one it's
        // really important and shouldn't be skipped
        globalErrorsHook.addError('Unexpected error during fetching EVM balances')
      })
      .finally(() => setFetchingFlagFunction(false))
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

  return (
    <Context.Provider value={{
      evmBalances, fetchingEvmBalances, solanaBalances, fetchingSolanaBalances,
    }}>
      {props.children}
    </Context.Provider>
  )
}

/**
 * Hook for using the balances store. The hook can be used in any component of the application to
 * access the store
 */
export const useBalances = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useBalances must be used within a BalancesProvider')
  }
  return context
}

