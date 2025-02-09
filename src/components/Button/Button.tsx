import { ButtonHTMLAttributes, FC } from 'react'

import { Spinner } from '../Spinner/Spinner'

import './Button.scss'

/** Represents props of {@link Button} */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Indicates if the button should have a loading spinner animation that overlaps everything
   * in the button
   * @default `undefined` which means there is no loading icon by default
   */
  loading?: boolean
}

/** Button component of the project. Can be used, for example, for a click action */
export const Button: FC<ButtonProps> = ({ loading, ...rest }) => {
  return (
    <button {...rest} className={`button ${loading ? 'button--loading' : ''} ${rest.className || ''}`}>
      {rest.children}
      {loading && <Spinner className='button__spinner' />}
    </button>
  )
}
