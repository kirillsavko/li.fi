import { FC, Fragment, PropsWithChildren } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsName, WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient, wagmiConfig } from '../../../services/wagmi.ts'

import { Button } from '../../Button/Button.tsx'

import './EvmAccount.scss'

/**
 * Via this component the user can see connected EVM account and can disconnect it
 */
const EvmAccountConnected: FC = () => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })

  return <>
    <div className='env-account__container'>
      <Button onClick={disconnect}>Disconnect</Button>
    </div>
    {address && <p>Address: {ensName || address}</p>}
  </>
}

/**
 * Via this component the user can connect their EVM account
 */
const ConnectEvmAccount: FC = () => {
  const { connectors, connect } = useConnect()

  return (
    <div className='env-account__container'>
      {connectors.map((connector) => <Fragment key={connector.uid}>
        <Button onClick={() => connect({ connector })}>
          {connector.name}
        </Button>
      </Fragment>)}
    </div>
  )
}

/**
 * EVM wallet provider. The application must be wrapped into this to interact with EVM
 */
export const EvmWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

/**
 * Represents props for {@link EvmAccount}
 */
type EvmAccountProps = {
  /**
   * Class name that applies to the component
   * @default `undefined` which means no class name is applied by default
   */
  className?: string
}

/**
 * Via this component the user can either connect or disconnect an EVM account
 */
export const EvmAccount: FC<EvmAccountProps> = props => {
  const { isConnected } = useAccount()

  return (
    <section className={props.className || ''}>
      <h2>EVM</h2>
      {isConnected ? <EvmAccountConnected /> : <ConnectEvmAccount />}
    </section>
  )
}
