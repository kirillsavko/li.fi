import { fireEvent } from '@testing-library/react'
import * as ConnectModule from '@stacks/connect'
import { screen } from '@testing-library/react'
import { act } from 'react'

import { BitcoinAccount } from '../BitcoinAccount.tsx'
import { renderWithProviders } from '../../../../test/renderWithProviders.tsx'

jest.mock('@stacks/connect', () => ({
  ...jest.requireActual('@stacks/connect'),
  showConnect: jest.fn(),
  signUserOut: jest.fn(),
}))

describe('BitcoinAccount tests', () => {
  it('className applies', async () => {
    await act(() => renderWithProviders(<BitcoinAccount className='test-classname-jest' />))
    const accountElement = screen.getByTestId('bitcoin-account')
    expect(accountElement).toHaveClass('test-classname-jest')
  })

  it('Renders button to connect if user did not connect account yet', async () => {
    jest.spyOn(ConnectModule.UserSession.prototype, 'isUserSignedIn').mockReturnValue(false)

    await act(() => renderWithProviders(<BitcoinAccount />))
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('Renders button to disconnect if user connected account', async () => {
    jest.spyOn(ConnectModule.UserSession.prototype, 'isUserSignedIn').mockReturnValue(true)
    jest.spyOn(ConnectModule.UserSession.prototype, 'loadUserData').mockReturnValue({
      profile: {
        btcAddress: {
          p2wpkh: {
            mainnet: '0x222'
          }
        }
      }
    })

    await act(() => renderWithProviders(<BitcoinAccount />))
    expect(screen.getByText('Disconnect')).toBeInTheDocument()
    expect(screen.getByText('Address: 0x222')).toBeInTheDocument()
  })

  it('Connect and disconnect flows work correctly', async () => {
    jest.spyOn(ConnectModule, 'showConnect').mockImplementation(({ onFinish }) => {
      onFinish({
        userSession: {
          isUserSignedIn: jest.fn().mockReturnValue(true),
          loadUserData: jest.fn().mockReturnValue({
            profile: {
              btcAddress: {
                p2wpkh: {
                  mainnet: '0x222'
                }
              }
            }
          }),
          signUserOut: jest.fn()
        },
      })
    })
    await act(() => renderWithProviders(<BitcoinAccount />))

    const connectButton = screen.getByText('Connect')
    expect(connectButton).toBeInTheDocument()
    fireEvent.click(connectButton)

    const disconnectButton = screen.getByText('Disconnect')
    expect(disconnectButton).toBeInTheDocument()
    fireEvent.click(disconnectButton)

    expect(screen.getByText('Connect')).toBeInTheDocument()
  })
})
