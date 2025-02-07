import { render } from '@testing-library/react'
import { AccountContainer, AccountRow, AccountAddress } from '../AccountBaseComponents.tsx'

describe('AccountBaseComponents tests', () => {
  it('Render children in AccountContainer', () => {
    const { getByText } = render(<AccountContainer>Jest children test</AccountContainer>)
    expect(getByText('Jest children test')).toBeInTheDocument()
  })

  it('Render children in AccountRow', () => {
    const { getByText } = render(<AccountRow>Jest children test</AccountRow>)
    expect(getByText('Jest children test')).toBeInTheDocument()
  })

  it('Render children in AccountAddress', () => {
    const { getByText } = render(<AccountAddress>Jest children test</AccountAddress>)
    expect(getByText('Jest children test')).toBeInTheDocument()
  })
});
