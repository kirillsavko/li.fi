import { FC } from 'react'

import { useBitcoinWallet } from '../../store/BitcoinWalletContext.tsx'

import { Button } from '../Button/Button.tsx'
import { AccountAddress, AccountRow } from './AccountBaseComponents/AccountBaseComponents.tsx'

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

  return (
    <section className={props.className || ''}>
      <h2>Bitcoin</h2>
      {bitcoinHook.user.isUserSignedIn() ? <BitcoinAccountConnected /> : <ConnectBitcoinAccount />}
    </section>
  );
}
