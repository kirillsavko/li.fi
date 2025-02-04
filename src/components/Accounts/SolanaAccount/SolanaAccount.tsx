import {
  ConnectionProvider, useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { clusterApiUrl, type PublicKey } from '@solana/web3.js';
import { FC, PropsWithChildren } from 'react';

import {
  useWalletModal,
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"

import { Button } from '../../Button/Button.tsx'

import '@solana/wallet-adapter-react-ui/styles.css'

const endpoint = clusterApiUrl('mainnet-beta');

const wallets = [new PhantomWalletAdapter()];

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

  return <>
    <Button onClick={disconnect}>
      Disconnect
    </Button>
    <p>Address: {props.publicKey.toBase58()}</p>
  </>
}

/**
 * Via this component the user can connect their Solana account
 */
const ConnectSolanaAccount: FC = () => {
  const { setVisible } = useWalletModal();

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
      <WalletProvider wallets={wallets} autoConnect={true}>
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

  return (
    <section className={props.className || ''}>
      <h2>Solana</h2>
      {publicKey ? <SolanaAccountConnected publicKey={publicKey} /> : <ConnectSolanaAccount />}
    </section>
  );
}
