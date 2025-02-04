import { FC } from 'react'

import { EvmAccount } from '../../components/Accounts/EvmAccount/EvmAccount.tsx'
import { SolanaAccount } from '../../components/Accounts/SolanaAccount/SolanaAccount.tsx'
import { BitcoinAccount } from '../../components/Accounts/BitcoinAccount/BitcoinAccount.tsx'

import './MainView.scss'

/**
 * Renders main view of the application that includes interaction with EVM, Solana and bitcoin
 */
export const MainView: FC = () => {
  return (
    <div className='main-view'>
      <EvmAccount className='main-view__account' />
      <SolanaAccount className='main-view__account' />
      <BitcoinAccount className='main-view__account' />
    </div>
  )
}
