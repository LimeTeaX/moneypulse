import { cx } from './utils'

export function Card({ children, className = '' }) {
  return <section className={cx('card', className)}>{children}</section>
}