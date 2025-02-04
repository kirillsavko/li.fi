import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'

import { getTokens, Token } from '../api/tokens.ts'
import { useGlobalErrors } from './GlobalErrorsContext.tsx'

/**
 * Represents structure of the tokens context
 */
type Context = {
  /**
   * List of all available tokens
   */
  tokens: Token[]
  /**
   * Fetches tokens
   */
  fetchTokens: () => void
  /**
   * Indicates if tokens are being fetched
   */
  fetchingTokens: boolean
}

/**
 * Created tokens context with the initial value
 */
const Context = createContext<Context | null>(null)

/**
 * Tokens provider that contains logic of the whole tokens store
 */
export const TokensProvider: FC<PropsWithChildren> = props => {
  const globalErrorsHook = useGlobalErrors()
  const [tokens, setTokens] = useState<Token[]>([])
  const [fetchingTokens, setFetchingTokens] = useState(false)

  function fetchTokens() {
    setFetchingTokens(true)
    getTokens()
      .then(setTokens)
      .catch(() => {
        // Ideally, all errors from the API should be caught here and based on the response status
        // code different error messages shown, but to save some time I won't do this. I believe
        // it can be skipped so far for the test application, but for the production one it's
        // really important and shouldn't be skipped
        globalErrorsHook.addError('Unexpected error during fetching tokens. Please refresh the page')
      })
      .finally(() => setFetchingTokens(false))
  }

  return (
    <Context.Provider value={{
      tokens, fetchTokens, fetchingTokens,
    }}>
      {props.children}
    </Context.Provider>
  )
}

/**
 * Hook for using the tokens store. The hook can be used in any component of the application to
 * access the store
 */
export const useTokens = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useTokens must be used within a TokensProvider')
  }
  return context
}
