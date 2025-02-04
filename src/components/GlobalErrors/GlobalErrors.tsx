import React from 'react'

import { GlobalError, useGlobalErrors } from '../../store/GlobalErrorsContext'

import './GlobalErrors.scss'

/**
 * Represents settings of timeout before hiding the global error item from UI.
 * For correct UI behaving values in both fields should be the same time duration,
 * just different format
 */
type TimeoutBeforeHiding = {
  /**
   * Timeout in milliseconds as a number for javascript
   * @example 6000
   */
  js: number
  /**
   * Timeout in seconds as a string for CSS
   * @example 6s
   */
  css: string
}

const TIMEOUT_BEFORE_HIDING: TimeoutBeforeHiding = {
  js: 6000,
  css: '6s',
}

/**
 * Represents props for {@link GlobalErrorItem}
 */
type GlobalErrorItemProps = {
  /**
   * Error the component should be rendered for
   */
  error: GlobalError
}

/**
 * Renders the given error as the component. In some time the error disappears
 */
const GlobalErrorItem: React.FC<GlobalErrorItemProps> = props => {
  const globalErrorsHook = useGlobalErrors()

  const hideComponent = () => {
    globalErrorsHook.removeError(props.error)
  }

  /**
   * The purpose of this hook is to remove this item from the store in some time,
   * which means the component will be unmounted
   */
  React.useEffect(() => {
    setTimeout(() => {
      hideComponent()
    }, TIMEOUT_BEFORE_HIDING.js)
  }, [])

  return (
    <button className='global-errors__item' onClick={hideComponent}>
      {props.error.text}
      <span
        className='global-errors__item-timeout-before-hiding'
        style={{ animationDuration: TIMEOUT_BEFORE_HIDING.css }}
      />
      <span className='global-errors__item-close-icon' />
    </button>
  )
}

/**
 * Renders all global errors that come from {@link useGlobalErrors}. Errors are rendered
 * in the right bottom corner of the application and every error disappears in some time
 */
export const GlobalErrors: React.FC = () => {
  const globalErrorsHook = useGlobalErrors()

  return (
    <section className='global-errors'>
      <ul className='global-errors__list'>
        {globalErrorsHook.errors.map(error => (
          <li key={error.id} className='global-errors__list-item'>
            <GlobalErrorItem error={error} />
          </li>
        ))}
      </ul>
    </section>
  )
}
