import { FC } from 'react'
import { ChainType } from '@lifi/types'

import { useBitcoinWallet } from '../../store/BitcoinWalletContext.tsx'
import { useBalances } from '../../store/BalancesContext.tsx'
import { useTokens } from '../../store/TokensContext.tsx'

import { Button } from '../Button/Button.tsx'
import { AccountAddress, AccountContainer, AccountRow } from './AccountBaseComponents/AccountBaseComponents.tsx'
import { Tokens } from '../Tokens/Tokens.tsx'

/**
 * Via this component the user can see connected bitcoin account and can disconnect it
 */
const BitcoinAccountConnected: FC = () => {
  const bitcoinHook = useBitcoinWallet()
  const address = bitcoinHook.user.loadUserData().profile.btcAddress.p2wpkh.mainnet

  return (
    <AccountRow>
      <Button onClick={bitcoinHook.disconnect}>Disconnect</Button>
      {address && <AccountAddress>Address: {address}</AccountAddress>}
    </AccountRow>
  )
}

/**
 * Via this component the user can connect their bitcoin account
 */
const ConnectBitcoinAccount: FC = () => {
  const bitcoinHook = useBitcoinWallet()

  return (
    <div>
      <Button onClick={bitcoinHook.connect}>Connect</Button>
    </div>
  )
}

/**
 * Represents props for {@link BitcoinAccount}
 */
type BitcoinAccountProps = {
  /**
   * Class name that applies to the component
   * @default `undefined` which means no class name is applied by default
   */
  className?: string
}

/**
 * Via this component the user can either connect or disconnect a bitcoin account
 */
export const BitcoinAccount: FC<BitcoinAccountProps> = props => {
  const bitcoinHook = useBitcoinWallet()
  const balancesHook = useBalances()
  const tokensHook = useTokens()

  const address = bitcoinHook.user.isUserSignedIn()
    ? bitcoinHook.user.loadUserData().profile.btcAddress.p2wpkh.mainnet
    : undefined

  return (
    <section className={props.className || ''} data-testid='bitcoin-account'>
      <AccountContainer>
        <h2>Bitcoin</h2>
        {bitcoinHook.user.isUserSignedIn() ? <BitcoinAccountConnected /> : <ConnectBitcoinAccount />}
      </AccountContainer>
      <Tokens
        balances={balancesHook.bitcoinBalances} fetchingBalances={balancesHook.fetchingBitcoinBalances}
        tokens={tokensHook.bitcoinTokens} fetchingTokens={tokensHook.fetchingBitcoinTokens}
        title='Tokens' address={address} type={ChainType.UTXO}
      />
    </section>
  );
}
