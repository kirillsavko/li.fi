import * as solanaWalletAdapterModule from '@solana/wallet-adapter-react'
import { screen } from '@testing-library/react'
import { act } from 'react'
import { renderWithProviders } from '../../../../test/renderWithProviders.tsx'
import { SolanaAccount } from '../SolanaAccount.tsx'

describe('SolanaAccount tests', () => {
  it('className applies', async () => {
    await act(() => renderWithProviders(<SolanaAccount className='jest-test' />))
    expect(screen.getByTestId('solana-account')).toHaveClass('jest-test')
  })

  it('Renders tokens table', async () => {
    await act(() => renderWithProviders(<SolanaAccount />))
    expect(screen.getByTestId('tokens')).toBeInTheDocument()
  })

  it('Renders button to connect if user did not connect account yet', async () => {
    jest.spyOn(solanaWalletAdapterModule, 'useWallet').mockReturnValue({
      publicKey: null,
    })
    await act(() => renderWithProviders(<SolanaAccount />))
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })

  it('Renders button to disconnect if user connected account', async () => {
    jest.spyOn(solanaWalletAdapterModule, 'useWallet').mockReturnValue({
      publicKey: { toBase58: jest.fn().mockReturnValue('0x333') },
    })
    await act(() => renderWithProviders(<SolanaAccount />))
    expect(screen.getByText('Disconnect')).toBeInTheDocument()
    expect(screen.getByText('Address: 0x333')).toBeInTheDocument()
  })
})
