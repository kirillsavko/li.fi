import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'
import { showConnect, UserSession } from '@stacks/connect'

import Placeholder from '../assets/images/placeholder.svg'

/**
 * Represents structure of the bitcoin wallet context
 */
type Context = {
  /**
   * Currently active user's session. If the user connected the account then contains
   * user's wallet data
   */
  user: UserSession
  /**
   * Connects the user's bitcoin account to the application
   */
  connect: () => void
  /**
   * Disconnects the user's bitcoin account to the application
   */
  disconnect: () => void
  /** Indicates if the user is currently connecting an account */
  connecting: boolean
  /** Indicates if the user is currently disconnecting an account */
  disconnecting: boolean
}

/**
 * Created bitcoin wallet context with the initial value
 */
const BitcoinWalletContext = createContext<Context | null>(null)

/**
 * Bitcoin wallet provider that contains logic of the whole bitcoin wallet store
 */
export const BitcoinWalletProvider: FC<PropsWithChildren> = props => {
  const [user, setUser] = useState(() => new UserSession())
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)

  function connect() {
    setConnecting(true)
    showConnect({
      appDetails: {
        name: 'Kiryl Sauko',
        icon: Placeholder as string,
      },
      onCancel: () => {
        setConnecting(false)
      },
      onFinish: (payload) => {
        setConnecting(false)
        setUser(payload.userSession)
      },
    })
  }

  function disconnect() {
    setDisconnecting(true)
    user.signUserOut()
    setDisconnecting(false)
    setUser(new UserSession())
  }

  return (
    <BitcoinWalletContext.Provider value={{ user, connect, disconnect, connecting, disconnecting }}>
      {props.children}
    </BitcoinWalletContext.Provider>
  )
}

/**
 * Hook for using the bitcoin wallet store. The hook can be used in any component of
 * the application to access the store
 */
export const useBitcoinWallet = () => {
  const context = useContext(BitcoinWalletContext)
  if (!context) {
    throw new Error('useBitcoinWallet must be used within a BitcoinWalletProvider')
  }
  return context
}
