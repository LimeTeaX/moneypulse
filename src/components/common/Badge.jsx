import { cx } from './utils'

export function Badge({ children, tone = 'green' }) {
  return <span className={cx('badge', `badge--${tone}`)}>{children}</span>
}