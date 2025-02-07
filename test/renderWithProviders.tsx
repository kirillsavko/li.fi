import { FC, PropsWithChildren, ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

import { AllProviders } from '../src/App.tsx'

/**
 * Basically, copy of {@link render} but it includes also providers that are used in the app.
 * So, if you want to test a component you probably want to use this function instead of
 * {@link render} if the component has some logic from a provider
 * @param ui What should be rendered for the test
 * @param options Options for rendering
 */
export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>) => {
  const Wrapper: FC<PropsWithChildren> = props => {
    return <AllProviders>{props.children}</AllProviders>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}
