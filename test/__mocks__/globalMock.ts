// We have to mock some library methods to make tests working
jest.mock('@lifi/sdk', () => ({
  ChainId: {},
  CoinKey: {},
  Token: {},
  ChainType: {
    EVM: 'EVM'
  },
  getTokens: jest.fn().mockReturnValue(Promise.resolve([])),
  EVM: jest.fn(),
  createConfig: jest.fn(),
  config: { setProviders: jest.fn() },
  Solana: jest.fn(),
}));

jest.mock('@lifi/wallet-management', () => ({
  useSyncWagmiConfig: jest.fn(),
}))

jest.mock('wagmi', () => ({
  useAccount: jest.fn().mockReturnValue({
    isConnected: true,
  }),
  http: jest.fn(),
  createConfig: jest.fn(),
  useEnsName: jest.fn().mockReturnValue({
    data: '',
  }),
  useConnect: jest.fn().mockReturnValue({
    connect: jest.fn(),
    connectors: [{ uid: '1', name: 'Jest connector' }],
  }),
  useDisconnect: jest.fn().mockReturnValue({
    disconnect: jest.fn(),
  }),
  WagmiProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@wagmi/core', () => ({
  getWalletClient: jest.fn(),
}))

jest.mock('wagmi/chains', () => ({
  base: '', mainnet: '',
}));

jest.mock('wagmi/connectors', () => ({
  walletConnect: jest.fn(),
}));

jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn().mockReturnValue(
    { publicKey: { toBase58: jest.fn().mockReturnValue('0x333') },
      wallet: {},
    }),
  ConnectionProvider: ({ children }: { children: React.ReactNode }) => children,
  WalletProvider: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('nanoid', () => ({
  nanoid: jest.fn().mockImplementation(() => Date.now().toString() + Math.random().toString(36).substring(2, 9))
}));

jest.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  QueryClient: jest.fn(),
  useQuery: jest.fn().mockReturnValue({ data: [] }),
}))
