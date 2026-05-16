export function Badge({ children, tone = 'green' }) {
  const colors = {
    green: { bg: 'var(--color-primary-pale)', text: 'var(--color-positive)' },
    red: { bg: 'rgba(248, 113, 113, 0.15)', text: 'var(--color-danger)' },
    gray: { bg: 'var(--color-surface-soft)', text: 'var(--color-mute)' },
    blue: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
    orange: { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316' },
  }
  const color = colors[tone] || colors.green
  
  return (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold" 
      style={{ backgroundColor: color.bg, color: color.text }}>
      {children}
    </span>
  )
}