import { FC, PropsWithChildren, StrictMode } from 'react'

import { TokensProvider } from './store/TokensContext.tsx'

import { BalancesProvider } from './store/BalancesContext.tsx'
import { MainView } from './views/MainView/MainView.tsx'
import { SolanaWalletProvider } from './components/Accounts/SolanaAccount.tsx'
import { EvmWalletProvider } from './components/Accounts/EvmAccount.tsx'
import { GlobalErrors } from './components/GlobalErrors/GlobalErrors.tsx'
import { GlobalErrorsProvider } from './store/GlobalErrorsContext.tsx'
import { SdkProvider } from './components/SdkProvider/SdkProvider.tsx'
import { BitcoinWalletProvider } from './store/BitcoinWalletContext.tsx'

import './App.scss'

/**
 * Renders all providers together that are required for the application
 */
export const AllProviders: FC<PropsWithChildren> = props => {
  return (
    <SolanaWalletProvider>
      <EvmWalletProvider>
        <BitcoinWalletProvider>
          <SdkProvider />
          <GlobalErrorsProvider>
            <TokensProvider>
              <BalancesProvider>
                <GlobalErrors />
                {props.children}
              </BalancesProvider>
            </TokensProvider>
          </GlobalErrorsProvider>
        </BitcoinWalletProvider>
      </EvmWalletProvider>
    </SolanaWalletProvider>
  )
}

/**
 * Renders the entire application
 */
export const App: FC = () => {
  return (
    <StrictMode>
      <AllProviders>
        <MainView />
      </AllProviders>
    </StrictMode>
  )
}
