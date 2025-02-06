import { FC } from 'react'

import { EvmAccount } from '../../components/Accounts/EvmAccount.tsx'
import { SolanaAccount } from '../../components/Accounts/SolanaAccount.tsx'
import { BitcoinAccount } from '../../components/Accounts/BitcoinAccount.tsx'

import './MainView.scss'

/**
 * Renders all accounts supported by the application
 */
const Accounts: FC = () => {
  // TODO: Use mapping here
  return (
    <ul className='main-view__accounts'>
      <li className='main-view__accounts-item'>
        <EvmAccount className='main-view__account'/>
      </li>
      <li className='main-view__accounts-item'>
        <SolanaAccount className='main-view__account'/>
      </li>
      <li className='main-view__accounts-item'>
        <BitcoinAccount className='main-view__account'/>
      </li>
    </ul>
  )
}

/**
 * Renders main view of the application that includes interaction with EVM, Solana and bitcoin
 */
export const MainView: FC = () => {
  return (
    <div className='main-view'>
      <Accounts />
    </div>
  )
}
