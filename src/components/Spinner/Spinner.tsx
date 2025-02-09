import { FC } from 'react'

import SpinnerIcon from '../../assets/icons/spinner.svg?react'

import './Spinner.scss'

/** Represents props for {@link Spinner} */
type SpinnerProps = {
  /**
   * Class name for the component
   * @default `undefined` which means no class name is applied by default
   */
  className?: string
}

/** Renders the spinner icon that infinitely rotating. The icon nested the color from the parent */
export const Spinner: FC<SpinnerProps> = props => {
  return (
    <SpinnerIcon className={`spinner ${props.className || ''}`} data-testid='spinner' />
  )
}
