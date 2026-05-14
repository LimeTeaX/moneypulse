import { cx } from './utils'

export function ActionButton({ children, icon: Icon, variant = 'primary', className = '' }) {
  return (
    <button className={cx('action-button', `action-button--${variant}`, className)} type="button">
      {Icon ? <Icon size={18} /> : null}
      <span>{children}</span>
    </button>
  )
}