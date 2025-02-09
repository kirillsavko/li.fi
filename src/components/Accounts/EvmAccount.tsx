import { FC, Fragment, PropsWithChildren } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsName, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChainType } from '@lifi/types'

import { wagmiConfig } from '../../services/wagmi.ts'
import { useTokens } from '../../store/TokensContext.tsx'
import { useBalances } from '../../store/BalancesContext.tsx'

import { Button } from '../Button/Button.tsx'
import { Tokens } from '../Tokens/Tokens.tsx'
import { AccountAddress, AccountContainer, AccountRow } from './AccountBaseComponents/AccountBaseComponents.tsx'

const queryClient = new QueryClient()

/** Via this component the user can see connected EVM account and can disconnect it */
const EvmAccountConnected: FC = () => {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { disconnect, isPending } = useDisconnect()

  return <AccountRow>
    <Button onClick={disconnect} disabled={isPending} loading={isPending}>Disconnect</Button>
    {(ensName || address) && <AccountAddress>Address: {ensName || address}</AccountAddress>}
  </AccountRow>
}

/** Via this component the user can connect their EVM account */
const ConnectEvmAccount: FC = () => {
  const { connectors, connect, isPending } = useConnect()

  return (
    <AccountRow>
      {connectors.map((connector) => <Fragment key={connector.uid}>
        <Button onClick={() => connect({ connector })} disabled={isPending} loading={isPending}>
          {connector.name}
        </Button>
      </Fragment>)}
    </AccountRow>
  )
}

/** EVM wallet provider. The application must be wrapped into this to interact with EVM */
export const EvmWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
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
  const { isConnected, address } = useAccount()
  const balancesHook = useBalances()
  const tokensHook = useTokens()

  return (
    <section className={props.className || ''} data-testid='evm-account'>
      <AccountContainer>
        <h2>EVM</h2>
        {isConnected ? <EvmAccountConnected /> : <ConnectEvmAccount />}
      </AccountContainer>
      <Tokens
        balances={balancesHook.evmBalances} fetchingBalances={balancesHook.fetchingEvmBalances}
        tokens={tokensHook.evmTokens} fetchingTokens={tokensHook.fetchingEvmTokens}
        title='Tokens' address={address} type={ChainType.EVM}
      />
    </section>
  )
}
