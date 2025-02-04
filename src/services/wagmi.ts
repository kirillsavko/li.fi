import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'

const projectId = import.meta.env.VITE_WAGMI_PROJECT_ID

/**
 * Wagmi configuration that is used for EVM
 */
export const wagmiConfig = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})

/**
 * Query client that is used for EVM
 */
export const queryClient = new QueryClient()
