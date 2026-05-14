import { Badge } from './Badge'
import { Card } from './Card'
import { IconTile } from './IconTile'
import { cx } from './utils'

export function MetricCard({ title, value, change, icon, tone = 'green', note }) {
  const badgeTone = tone === 'red' || tone === 'orange' || tone === 'blue' ? tone : 'green'

  return (
    <Card className="metric-card">
      <div className="metric-main">
        <div>
          <p className="muted-label">{title}</p>
          <h3>{value}</h3>
        </div>
        <IconTile icon={icon} tone={tone} />
      </div>
      <div className="metric-footer">
        <Badge tone={badgeTone}>{change}</Badge>
        {note ? <span>{note}</span> : null}
      </div>
    </Card>
  )
}