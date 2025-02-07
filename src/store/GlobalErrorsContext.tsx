import { nanoid } from 'nanoid'
import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'

/**
 * Represents structure of the error
 */
export type GlobalError = {
  /**
   * Id of the error
   * @example LQiym1YGIKguNsWbFbKYQ
   */
  id: string
  /**
   * Text that explains why the error popped up
   */
  text: string
}

/**
 * Represents structure of the global error context
 */
type Context = {
  /**
   * List of all errors. All errors are rendered right now in {@link GlobalErrors}
   */
  errors: GlobalError[]
  /**
   * Adds the given error to the state
   * @param errorText Text of the error that explains the root cause
   */
  addError: (errorText: string) => void
  /**
   * Removes the give error from the state
   * @param errorToRemove Error that should be removed from the state
   */
  removeError: (errorToRemove: GlobalError) => void
}

/**
 * Created global error context with the initial value
 */
const GlobalErrorsContext = createContext<Context | null>(null)

/**
 * Global error provider that contains logic of the whole global error store
 */
export const GlobalErrorsProvider: FC<PropsWithChildren> = props => {
  const [errors, setErrors] = useState<GlobalError[]>([])

  const addError = (errorText: string) => {
    const newError: GlobalError = {
      text: errorText, id: nanoid(),
    }
    setErrors(prev => [...prev, newError])
  }

  const removeError = (errorToRemove: GlobalError) => {
    setErrors(prev => prev.filter(error => error.id !== errorToRemove.id))
  }

  return (
    <GlobalErrorsContext.Provider value={{
      errors, addError, removeError,
    }}>
      {props.children}
    </GlobalErrorsContext.Provider>
  )
}

/**
 * Hook for using the global error store. The hook can be used in any component of the
 * application to access the store
 */
export const useGlobalErrors = () => {
  const context = useContext(GlobalErrorsContext)
  if (!context) {
    throw new Error('useGlobalErrors must be used within a GlobalErrorsProvider')
  }
  return context
}
