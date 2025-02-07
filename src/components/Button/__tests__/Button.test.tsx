import { fireEvent, render, screen } from '@testing-library/react'
import { Button } from '../Button.tsx'

describe('Button tests', () => {
  it('Renders children element', () => {
    render(<Button>test jest</Button>)
    expect(screen.getByText('test jest')).toBeInTheDocument()
  })

  it('Spinner shown when button is loading', () => {
    render(<Button />)
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    render(<Button loading />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('Click works', () => {
    const mockClick = jest.fn()
    render(<Button onClick={mockClick} />)
    expect(mockClick).not.toHaveBeenCalled()
    expect(mockClick).toHaveBeenCalledTimes(0)

    fireEvent.click(screen.getByRole('button'))

    expect(mockClick).toHaveBeenCalled()
    expect(mockClick).toHaveBeenCalledTimes(1)
  })
})
