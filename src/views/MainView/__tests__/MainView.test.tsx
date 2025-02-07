import { act } from 'react'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../test/renderWithProviders.tsx'
import { MainView } from '../MainView.tsx'

describe('MainView tests', () => {
  it('Renders all accounts', async () => {
    await act(() => renderWithProviders(<MainView />))
    expect(screen.getByTestId('evm-account')).toBeInTheDocument()
    expect(screen.getByTestId('solana-account')).toBeInTheDocument()
    expect(screen.getByTestId('bitcoin-account')).toBeInTheDocument()
  })
})
