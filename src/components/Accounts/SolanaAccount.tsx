import {
  ConnectionProvider, useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { clusterApiUrl, type PublicKey } from '@solana/web3.js';
import { FC, PropsWithChildren } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

import {
  useWalletModal,
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { useBalances } from '../../store/BalancesContext.tsx'
import { useTokens } from '../../store/TokensContext.tsx'

import { Button } from '../Button/Button.tsx'
import { Tokens } from '../Tokens/Tokens.tsx'
import { AccountAddress, AccountContainer, AccountRow } from './AccountBaseComponents/AccountBaseComponents.tsx'

import '@solana/wallet-adapter-react-ui/styles.css'

const endpoint = clusterApiUrl(WalletAdapterNetwork.Mainnet);

/**
 * Represents props of {@link SolanaAccountConnected}
 */
type SolanaAccountConnectedProps = {
  /**
   * Public key of the solana account the user connetcted
   */
  publicKey: PublicKey
}

/**
 * Via this component the user can see connected Solana account and can disconnect it
 */
const SolanaAccountConnected: FC<SolanaAccountConnectedProps> = props => {
  const { disconnect } = useWallet();

  return (
    <AccountRow>
      <Button onClick={disconnect}>
        Disconnect
      </Button>
      <AccountAddress>Address: {props.publicKey.toBase58()}</AccountAddress>
    </AccountRow>
  )
}

/**
 * Via this component the user can connect their Solana account
 */
const ConnectSolanaAccount: FC = () => {
  const {setVisible} = useWalletModal();

  return (
    <Button onClick={() => setVisible(true)}>
      Connect Wallet
    </Button>
  )
}

/**
 * Solana wallet provider. The application must be wrapped into this to interact with Solana
 */
export const SolanaWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

/**
 * Represents props for {@link SolanaAccount}
 */
type SolanaAccountProps = {
  /**
   * Class name that applies to the component
   * @default `undefined` which means no class name is applied by default
   */
  className?: string
}

/**
 * Via this component the user can either connect or disconnect a Solana account
 */
export const SolanaAccount: FC<SolanaAccountProps> = props => {
  const { publicKey } = useWallet();
  const balancesHook = useBalances()
  const tokensHook = useTokens()

  return (
    <section className={props.className || ''}>
      <AccountContainer>
        <h2>Solana</h2>
        {publicKey ? <SolanaAccountConnected publicKey={publicKey} /> : <ConnectSolanaAccount />}
      </AccountContainer>
      <Tokens
        balances={balancesHook.solanaBalances} fetchingBalances={balancesHook.fetchingSolanaBalances}
        tokens={tokensHook.solanaTokens} fetchingTokens={tokensHook.fetchingSolanaTokens}
        title='Tokens' address={publicKey?.toString()}
      />
    </section>
  );
}
