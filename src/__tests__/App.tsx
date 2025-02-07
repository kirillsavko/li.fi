import { act } from 'react'
import { render, screen } from '@testing-library/react'
import { App } from '../App.tsx'

describe('App tests', () => {
  it('Renders main view', async () => {
    await act(() => render(<App />))
    expect(screen.getByTestId('main-view')).toBeInTheDocument()
  })
})
