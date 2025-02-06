import { FC, PropsWithChildren } from 'react'

import './AccountBaseComponents.scss'

/** Renders a children component with a bottom margin */
export const AccountContainer: FC<PropsWithChildren> = props => {
  return (
    <div className='account__container'>{props.children}</div>
  )
}

/** Renders a children component in a row with some gap between elements */
export const AccountRow: FC<PropsWithChildren> = props => {
  return (
    <div className='account__inline-row'>{props.children}</div>
  )
}

/**
 * Renders a children component that breaks letters to the new line if not enough space is left.
 * Should be used for blockchain addresses
 */
export const AccountAddress: FC<PropsWithChildren> = props => {
  return (
    <p className='account__address'>{props.children}</p>
  )
}
