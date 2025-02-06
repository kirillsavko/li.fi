import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'
import { CreateConnectorFn } from '@wagmi/core'

const projectId = import.meta.env.VITE_WAGMI_PROJECT_ID

/**
 * List of all wagmi connectors
 */
export const wagmiConnectors: CreateConnectorFn[] = [walletConnect({ projectId })]

/**
 * Wagmi configuration that is used for EVM
 */
export const wagmiConfig = createConfig({
  chains: [mainnet, base],
  connectors: wagmiConnectors,
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})
