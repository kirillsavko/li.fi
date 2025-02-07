import * as wagmiModule from 'wagmi'
import { screen } from '@testing-library/react'
import { act } from 'react'

import { EvmAccount } from '../EvmAccount.tsx'
import { renderWithProviders } from '../../../../test/renderWithProviders.tsx'

describe('EvmAccount tests', () => {
  it('className applies', async () => {
    await act(() => renderWithProviders(<EvmAccount className='jest-test' />))
    expect(screen.getByTestId('evm-account')).toHaveClass('jest-test')
  })

  it('Renders tokens table', async () => {
    await act(() => renderWithProviders(<EvmAccount />))
    expect(screen.getByTestId('tokens')).toBeInTheDocument()
  })

  it('Renders button to connect if user did not connect account yet', async () => {
    jest.spyOn(wagmiModule, 'useAccount').mockReturnValue({
      isConnected: false,
    })
    await act(() => renderWithProviders(<EvmAccount />))
    expect(screen.getByText('Jest connector')).toBeInTheDocument()
  })

  it('Renders button to disconnect if user connected account', async () => {
    jest.spyOn(wagmiModule, 'useAccount').mockReturnValue({
      isConnected: true, address: '0x876',
    })
    await act(() => renderWithProviders(<EvmAccount />))
    expect(screen.getByText('Disconnect')).toBeInTheDocument()
    expect(screen.getByText('Address: 0x876')).toBeInTheDocument()
  })
})
