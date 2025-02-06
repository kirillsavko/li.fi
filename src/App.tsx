import { FC, StrictMode } from 'react'

import { TokensProvider } from './store/TokensContext.tsx'

import { BalancesProvider } from './store/BalancesContext.tsx'
import { MainView } from './views/MainView/MainView.tsx'
import { SolanaWalletProvider } from './components/Accounts/SolanaAccount/SolanaAccount.tsx'
import { EvmWalletProvider } from './components/Accounts/EvmAccount/EvmAccount.tsx'
import { GlobalErrors } from './components/GlobalErrors/GlobalErrors.tsx'
import { GlobalErrorsProvider } from './store/GlobalErrorsContext.tsx'
import { SdkProvider } from './components/SdkProvider/SdkProvider.tsx'
import { BitcoinWalletProvider } from './store/BitcoinWalletContext.tsx'

import './App.scss'

/**
 * Renders the entire application
 */
export const App: FC = () => {

  return (
    <StrictMode>
      <SolanaWalletProvider>
        <EvmWalletProvider>
          <BitcoinWalletProvider>
            <SdkProvider />
            <GlobalErrorsProvider>
              <TokensProvider>
                <BalancesProvider>
                  <GlobalErrors />
                  <MainView />
                </BalancesProvider>
              </TokensProvider>
            </GlobalErrorsProvider>
          </BitcoinWalletProvider>
      </EvmWalletProvider>
      </SolanaWalletProvider>
    </StrictMode>
  )
}
