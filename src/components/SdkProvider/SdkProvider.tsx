import { FC, useEffect } from 'react'
import { ChainType, config, createConfig, EVM, getChains, Solana } from '@lifi/sdk'
import { getWalletClient, switchChain } from '@wagmi/core'
import { wagmiConfig, wagmiConnectors } from '../../services/wagmi.ts'
import { useWallet } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { useSyncWagmiConfig } from '@lifi/wallet-management'

/**
 * Configures SDK providers allowing to interact with EVM and Solana networks.
 * Check documentation for more information: https://docs.li.fi/integrate-li.fi-sdk/configure-sdk-providers
 */
export const SdkProvider: FC = () => {
  const { wallet } = useWallet()

  // Load chains from LI.FI API using getChains action from LI.FI SDK
  const { data: chains } = useQuery({
    queryKey: ['chains'] as const,
    queryFn: async () => {
      const chains = await getChains({
        chainTypes: [ChainType.EVM, ChainType.SVM],
      })
      // Update chain configuration for LI.FI SDK
      config.setChains(chains)
      return chains
    },
  })

  // Synchronize fetched chains with Wagmi config and update connectors
  useSyncWagmiConfig(wagmiConfig, wagmiConnectors, chains)

  // EVM
  useEffect(() => {
    createConfig({
      integrator: 'Kiryl Sauko',
      providers: [
        EVM({
          getWalletClient: () => getWalletClient(wagmiConfig),
          switchChain: async (chainId: number) => {
            const chain = await switchChain(wagmiConfig, { chainId })
            const walletClient = getWalletClient(wagmiConfig, { chainId: chain.id })
            return walletClient || undefined
          }
        }),
      ],
      preloadChains: false,
    })
  }, [])

  // Solana
  useEffect(() => {
    config.setProviders([
      Solana({
        async getWalletAdapter() {
          return wallet?.adapter
        },
      }),
    ])
  }, [wallet?.adapter])

  return null
}
