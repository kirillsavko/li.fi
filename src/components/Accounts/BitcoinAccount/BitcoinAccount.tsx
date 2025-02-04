import { FC } from 'react'

/**
 * Represents props for {@link BitcoinAccount}
 */
type BitcoinAccountProps = {
  /**
   * Class name that applies to the component
   * @default `undefined` which means no class name is applied by default
   */
  className?: string
}

/**
 * Via this component the user can either connect or disconnect a bitcoin account
 */
export const BitcoinAccount: FC<BitcoinAccountProps> = props => {
  return (
    <section className={props.className || ''}>
      <h2>Bitcoin</h2>
    </section>
  );
}
