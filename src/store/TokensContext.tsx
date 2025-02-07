import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { ChainType, getTokens, Token } from '@lifi/sdk'

import { useGlobalErrors } from './GlobalErrorsContext.tsx'
import { parseTokensFromApi } from '../services/tokens.ts'

/**
 * Represents structure of the tokens context
 */
type Context = {
  /**
   * List of all available EVM tokens
   */
  evmTokens: Token[]
  /**
   * Indicates if EVM tokens are being fetched
   */
  fetchingEvmTokens: boolean
  /**
   * List of all available Solana tokens
   */
  solanaTokens: Token[]
  /**
   * Indicates if Solana tokens are being fetched
   */
  fetchingSolanaTokens: boolean
}

/**
 * Created tokens context with the initial value
 */
const TokensContext = createContext<Context | null>(null)

/**
 * Tokens provider that contains logic of the whole tokens store
 */
export const TokensProvider: FC<PropsWithChildren> = props => {
  const globalErrorsHook = useGlobalErrors()
  const [evmTokens, setEvmTokens] = useState<Token[]>([])
  const [fetchingEvmTokens, setFetchingEvmTokens] = useState(false)
  const [solanaTokens, setSolanaTokens] = useState<Token[]>([])
  const [fetchingSolanaTokens, setFetchingSolanaTokens] = useState(false)

  const fetchEvmTokens = () => {
    setFetchingEvmTokens(true)
    getTokens({
      chainTypes: [ChainType.EVM]
    })
      .then(tokens => {
        const parsedTokens = parseTokensFromApi(tokens)
        setEvmTokens(parsedTokens)
      })
      .catch(() => {
        // Ideally, all errors from the API should be caught here and based on the response status
        // code different error messages shown, but to save some time I won't do this. I believe
        // it can be skipped so far for the test application, but for the production one it's
        // really important and shouldn't be skipped
        globalErrorsHook.addError('Unexpected error during fetching EVM tokens. Please refresh the page')
      })
      .finally(() => setFetchingEvmTokens(false))
  }

  const fetchSolanaTokens = () => {
    setFetchingSolanaTokens(true)
    getTokens({
      chainTypes: [ChainType.SVM]
    })
      .then(tokens => {
        const parsedTokens = parseTokensFromApi(tokens)
        setSolanaTokens(parsedTokens)
      })
      .catch(() => {
        // Ideally, all errors from the API should be caught here and based on the response status
        // code different error messages shown, but to save some time I won't do this. I believe
        // it can be skipped so far for the test application, but for the production one it's
        // really important and shouldn't be skipped
        globalErrorsHook.addError('Unexpected error during fetching Solana tokens. Please refresh the page')
      })
      .finally(() => setFetchingSolanaTokens(false))
  }

  /**
   * Gets all necessary data once during initialization to be accessible in the entire application
   */
  useEffect(() => {
    fetchEvmTokens()
    fetchSolanaTokens()
  }, [])

  return (
    <TokensContext.Provider value={{
      evmTokens, fetchingEvmTokens, solanaTokens, fetchingSolanaTokens,
    }}>
      {props.children}
    </TokensContext.Provider>
  )
}

/**
 * Hook for using the tokens store. The hook can be used in any component of the application to
 * access the store
 */
export const useTokens = () => {
  const context = useContext(TokensContext)
  if (!context) {
    throw new Error('useTokens must be used within a TokensProvider')
  }
  return context
}
