import { render } from '@testing-library/react'
import { ChainType } from '@lifi/types'

import { Tokens } from '../Tokens.tsx'
import { mockToken } from '../../../../test/__mocks__/tokens.ts'
import { mockBalance } from '../../../../test/__mocks__/balances.ts'

describe('Tokens component tests', () => {
  it('Renders title', () => {
    const { getByText } = render(<Tokens
      tokens={[]} fetchingTokens={false} balances={[]} fetchingBalances={false} title='Jest title'
      address='' type={ChainType.EVM}
    />)
    expect(getByText('Jest title')).toBeInTheDocument()
  })

  it('Renders spinner when fetching tokens', () => {
    const { getByTestId } = render(<Tokens
      tokens={[]} fetchingTokens={true} balances={[]} fetchingBalances={false} title=''
      address='' type={ChainType.EVM}
    />)
    expect(getByTestId('spinner')).toBeInTheDocument()
  })

  it('Renders label when no tokens provided', () => {
    const { getByText } = render(<Tokens
      tokens={[]} fetchingTokens={false} balances={[]} fetchingBalances={false} title=''
      address='' type={ChainType.EVM}
    />)
    expect(getByText('No data provided')).toBeInTheDocument()
  })

  it('Renders spinner when fetching balances and address exists', () => {
    const { getByTestId, getByText } = render(<Tokens
      tokens={[mockToken]} fetchingTokens={false} balances={[]} fetchingBalances={true} title=''
      address='0x123' type={ChainType.EVM}
    />)
    expect(getByTestId('spinner')).toBeInTheDocument()
    expect(getByText('Fetching balances')).toBeInTheDocument()
  })

  it('Renders token', () => {
    const { getByText, getByAltText } = render(<Tokens
      tokens={[mockToken]} fetchingTokens={false} balances={[]} fetchingBalances={false} title=''
      address='0x123' type={ChainType.EVM}
    />)
    const tokenImage = getByAltText(mockToken.symbol)

    expect(tokenImage).toBeInTheDocument()
    expect(tokenImage).toHaveAttribute('src', mockToken.logoURI)
    expect(getByText(`${mockToken.name} (${mockToken.symbol})`)).toBeInTheDocument()
  })

  it('Renders balance to token', () => {
    const { getByText } = render(<Tokens
      tokens={[mockToken]} fetchingTokens={false} balances={[mockBalance]} fetchingBalances={false} title=''
      address='0x123' type={ChainType.EVM}
    />)

    expect(getByText('Balance: 1e-17')).toBeInTheDocument()
  })
})
