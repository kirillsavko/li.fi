import { FC, StrictMode } from 'react'

import { MainView } from './views/MainView/MainView.tsx'
import { SolanaWalletProvider } from './components/Accounts/SolanaAccount/SolanaAccount.tsx'
import { EvmWalletProvider } from './components/Accounts/EvmAccount/EvmAccount.tsx'

import './App.scss'

/**
 * Renders the entire application
 */
export const App: FC = () => {
  return (
    <StrictMode>
      <SolanaWalletProvider>
        <EvmWalletProvider>
          <MainView />
        </EvmWalletProvider>
      </SolanaWalletProvider>
    </StrictMode>
  )
}
