import { FC, FunctionComponent } from 'react'

import { EvmAccount } from '../../components/Accounts/EvmAccount.tsx'
import { SolanaAccount } from '../../components/Accounts/SolanaAccount.tsx'
import { BitcoinAccount } from '../../components/Accounts/BitcoinAccount.tsx'

import './MainView.scss'

type Account = {
  /** Id of the account */
  id: string
  /** Component for the account */
  component: FunctionComponent
}

/** List of all accounts that have to be rendered on the page */
const accounts: Account[] = [
  { id: 'EVM', component: EvmAccount },
  { id: 'Solana', component: SolanaAccount },
  { id: 'Bitcoin', component: BitcoinAccount },
]

/** Renders all accounts supported by the application */
const Accounts: FC = () => {
  return (
    <ul className='main-view__accounts'>
      {accounts.map(account => (
        <li key={account.id} className='main-view__accounts-item'>
          <account.component className='main-view__account' />
        </li>
      ))}
    </ul>
  )
}

/** Renders main view of the application that includes interaction with EVM, Solana and bitcoin */
export const MainView: FC = () => {
  return (
    <div className='main-view' data-testid='main-view'>
      <Accounts />
    </div>
  )
}
