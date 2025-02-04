import { FC, useEffect } from 'react'
import { FixedSizeList } from 'react-window'

import { useTokens } from '../../store/TokensContext.tsx'

import { Spinner } from '../Spinner/Spinner.tsx'

import './Tokens.scss'

/**
 * Renders all tokens in a table that handles too many rows. The table renders items that are
 * only in the viewport, otherwise users wouldn't be able to use the page since it'd just
 * lag a lot due the huge tokens list
 */
const List: FC = () => {
  const tokensHook = useTokens()

  return <>
    {tokensHook.tokens.length === 0
      ? <h4 className='tokens__list-no-data'>No data provided</h4>
      : <FixedSizeList
          height={500}
          itemCount={tokensHook.tokens.length}
          itemSize={50}
          width={'100%'}
          className='tokens__list'
        >
          {({ index, style }) => {
            const token = tokensHook.tokens[index];
            return (
              <div style={style} className='tokens__list-item'>
                {token.logoURI && <img src={token.logoURI} alt={token.symbol} className='tokens__list-item-image' />}
                {/* TODO: Add a placeholder image for all tokens without the logo to have
              the list consistent and all texts on the same position */}
                <span>{token.name} ({token.symbol})</span>
              </div>
            );
          }}
      </FixedSizeList>}

  </>
}

/**
 * Fetches all tokens and then renders it. During fetching a spinner is shown
 */
export const Tokens: FC = () => {
  const tokensHook = useTokens()

  useEffect(() => {
    tokensHook.fetchTokens()
  }, [])

  return (
    <section>
      <h2>Tokens list</h2>
      {tokensHook.fetchingTokens ? <Spinner className='tokens__spinner' /> : <List />}
    </section>
  );
}
