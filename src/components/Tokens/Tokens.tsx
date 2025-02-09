import { CSSProperties, FC, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { ChainType, Token, TokenAmount } from '@lifi/sdk'
import Decimal from 'decimal.js'

import { getTokenBalanceForUi } from '../../services/balances.ts'
import { BitcoinTokenAmount } from '../../api/bitcoinBalance.ts'

import { Spinner } from '../Spinner/Spinner.tsx'

import Placeholder from '../../assets/images/placeholder.svg'

import './Tokens.scss'

/** Represents structure of props of {@link ListRow} which are always there regardless the token type */
type ListRowBaseProps = {
  /** Token the row should be rendered for */
  token: Token
  /** Styles for the row */
  style: CSSProperties
  /** Address balances should be rendered for. No address if user didn't connect the account */
  address: string | undefined
}
/** Represents props structure of {@link ListRow} for Bitcoin tokens */
type ListRowBitcoinProps = ListRowBaseProps & {
  /** Balance of the token if exists */
  balance: BitcoinTokenAmount | undefined
  /** Chain type the row is rendered for */
  type: ChainType.UTXO
}
/** Represents props structure of {@link ListRow} for EVM or Solana tokens */
type ListRowEvmOrSolanaProps = ListRowBaseProps & {
  /** Balance of the token if exists */
  balance: TokenAmount | undefined
  /** Chain type the row is rendered for */
  type: ChainType.EVM | ChainType.SVM
}
/** Represents props of {@link ListRow} */
type ListRowProps = ListRowBitcoinProps | ListRowEvmOrSolanaProps

/** Renders one token row in {@link List} */
const ListRow: FC<ListRowProps> = props => {
  // TODO: Adjust vite to remove as string
  const imgSrc = props.token.logoURI || Placeholder as string
  const imgAlt = props.token.logoURI ? props.token.symbol : 'Gray placeholder image'

  const balance = useMemo(() => {
    if (!props.balance || !props.address) {
      return undefined
    }
    if (props.type === ChainType.EVM || props.type === ChainType.SVM) {
      return getTokenBalanceForUi(props.balance)
    }
    if (props.type === ChainType.UTXO) {
      const satoshisBalance = new Decimal(props.balance.chain_stats.funded_txo_sum)
        .minus(props.balance.chain_stats.spent_txo_sum)
      return satoshisBalance.div(100_000_000).toString()
    }
  }, [props.type, props.balance, props.address])

  return (
    <div style={props.style} className='tokens__list-item'>
      <img src={imgSrc} alt={imgAlt} className='tokens__list-item-image' />
      <span>{props.token.name} ({props.token.symbol})</span>
      <div className='tokens__list-item-balance'>
        {balance && <>Balance: {balance}</>}
      </div>
    </div>
  )
}

const LIST_ITEM_HEIGHT = 50
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
        // Either the height is 500 or less if there are not many items
        height={Math.min(500, LIST_ITEM_HEIGHT * props.tokens.length)}
        itemCount={props.tokens.length}
        itemSize={LIST_ITEM_HEIGHT}
        width={'100%'}
        className='tokens__list'
      >
        {({ index, style }) => {
          const token = props.tokens[index]
          const balance = props.balances[index]

          return <ListRow
            token={token} style={style} balance={balance} address={props.address}
            type={props.type}
          />
        }}
      </FixedSizeList>
    </div>
  </>
}

/** Represents props structure of {@link Tokens} which are always there regardless the token type */
type BaseTokensProps = {
  /** List of all tokens that should be rendered */
  tokens: Token[]
  /** Indicates if tokens are currently being fetched */
  fetchingTokens: boolean
  /** Indicates if balances are currently being fetched */
  fetchingBalances: boolean
  /** Title that is rendered before the table */
  title: string
  /** Address balances should be rendered for. No address if user didn't connect the account */
  address: string | undefined
}
/** Represents props structure of {@link Tokens} for Bitcoin tokens */
type BitcoinTokensProps = BaseTokensProps & {
  /** List of all balances for the tokens */
  balances: BitcoinTokenAmount[]
  /** Chain type the tokens are rendered for */
  type: ChainType.UTXO
}
/** Represents props structure of {@link Tokens} for EVM or Solana tokens */
type EvmOrSolanaTokensProps = BaseTokensProps & {
  /** List of all balances for the tokens */
  balances: TokenAmount[]
  /** Chain type the tokens are rendered for */
  type: ChainType.EVM | ChainType.SVM
}
/** Represents props structure of {@link Tokens} */
type TokensProps = BitcoinTokensProps | EvmOrSolanaTokensProps

/**
 * Renders all tokens and its balances. During fetching a spinner is shown
 */
export const Tokens: FC<TokensProps> = props => {
  return (
    <section data-testid='tokens'>
      <h3>{props.title}</h3>
      {props.fetchingTokens
        ? <Spinner className='tokens__spinner'/>
        : <List {...props} />}
    </section>
  );
}
