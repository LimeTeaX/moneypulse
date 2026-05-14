import { cx } from './utils'

export function IconTile({ icon: Icon, tone = 'green', size = 24 }) {
  return (
    <div className={cx('icon-tile', `icon-tile--${tone}`)}>
      <Icon size={size} />
    </div>
  )
}