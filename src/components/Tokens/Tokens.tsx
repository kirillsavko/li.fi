import { CSSProperties, FC, useEffect } from 'react'
import { FixedSizeList } from 'react-window'
import { Token, TokenAmount } from '@lifi/sdk'

import { getTokenBalanceForUi } from '../../services/balances.ts'

import { Spinner } from '../Spinner/Spinner.tsx'

import Placeholder from '../../assets/images/placeholder.svg'

import './Tokens.scss'

type ListRowProps = {
  /** Token the row should be rendered for */
  token: Token
  /** Styles for the row */
  style: CSSProperties
  /** Balance of the token if exists */
  balance: TokenAmount | undefined
  /** Address balances should be rendered for. No address if user didn't connect the account */
  address: string | undefined
}

const ListRow: FC<ListRowProps> = props => {
  // TODO: Adjust vite to remove as string
  const imgSrc = props.token.logoURI || Placeholder as string
  const imgAlt = props.token.logoURI ? props.token.symbol : 'Gray placeholder image'

  return (
    <div style={props.style} className='tokens__list-item'>
      <img src={imgSrc} alt={imgAlt} className='tokens__list-item-image' />
      <span>{props.token.name} ({props.token.symbol})</span>
      <div className='tokens__list-item-balance'>
        {props.balance && props.address && <>Balance: {getTokenBalanceForUi(props.balance)}</>}
      </div>
    </div>
  )
}

/**
 * Renders all tokens in a table that handles too many rows. The table renders items that are
 * only in the viewport, otherwise users wouldn't be able to use the page since it'd just
 * lag a lot due the huge tokens list
 */
const List: FC<TokensProps> = props => {
  if (props.tokens.length === 0) {
    return <h4 className='tokens__list-no-data'>No data provided</h4>
  }

  return <>
    <div className='tokens__wrapper'>
      {props.fetchingBalances && props.address && <div className='tokens__fetching-balances'>
        Fetching balances
        <Spinner className='tokens__fetching-balances-spinner' />
      </div>}
      <FixedSizeList
        height={500}
        itemCount={props.tokens.length}
        itemSize={50}
        width={'100%'}
        className='tokens__list'
      >
        {({ index, style }) => {
          const token = props.tokens[index]
          const balance = props.balances[index]

          return <ListRow token={token} style={style} balance={balance} address={props.address} />
        }}
      </FixedSizeList>
    </div>
  </>
}

type TokensProps = {
  /** List of all tokens that should be rendered */
  tokens: Token[]
  /** Indicates if tokens are currently being fetched */
  fetchingTokens: boolean
  /** List of all balances for the tokens */
  balances: TokenAmount[]
  /** Indicates if balances are currently being fetched */
  fetchingBalances: boolean
  /** Title that is rendered before the table */
  title: string
  /** Address balances should be rendered for. No address if user didn't connect the account */
  address: string | undefined
}

/**
 * Renders all tokens and its balances. During fetching a spinner is shown
 */
export const Tokens: FC<TokensProps> = props => {
  return (
    <section>
      <h3>{props.title}</h3>
      {props.fetchingTokens
        ? <Spinner className='tokens__spinner'/>
        : <List {...props} />}
    </section>
  );
}
