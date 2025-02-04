import { FC, StrictMode } from 'react'

import { TokensProvider } from './store/TokensContext.tsx'

import { MainView } from './views/MainView/MainView.tsx'
import { SolanaWalletProvider } from './components/Accounts/SolanaAccount/SolanaAccount.tsx'
import { EvmWalletProvider } from './components/Accounts/EvmAccount/EvmAccount.tsx'
import { GlobalErrors } from './components/GlobalErrors/GlobalErrors.tsx'
import { GlobalErrorsProvider } from './store/GlobalErrorsContext.tsx'

import './App.scss'

/**
 * Renders the entire application
 */
export const App: FC = () => {
  return (
    <StrictMode>
      <SolanaWalletProvider>
        <EvmWalletProvider>
          <GlobalErrorsProvider>
            <TokensProvider>
              <GlobalErrors />
              <MainView />
            </TokensProvider>
          </GlobalErrorsProvider>
        </EvmWalletProvider>
      </SolanaWalletProvider>
    </StrictMode>
  )
}
