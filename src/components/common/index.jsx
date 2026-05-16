import { ArrowRight } from 'lucide-react'

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

export function IconTile({ icon: Icon, tone = 'green', size = 20 }) {
  const colors = {
    green: { bg: 'var(--color-primary-pale)', text: 'var(--color-positive)' },
    red: { bg: 'rgba(248, 113, 113, 0.15)', text: 'var(--color-danger)' },
    gray: { bg: 'var(--color-surface-soft)', text: 'var(--color-mute)' },
    blue: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
    orange: { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316' },
  }
  const color = colors[tone] || colors.green
  
  return (
    <div className="flex items-center justify-center rounded-xl w-10 h-10 shrink-0" style={{ backgroundColor: color.bg }}>
      <Icon size={size} style={{ color: color.text }} />
    </div>
  )
}

export function Card({ children, className = '', tone = 'white' }) {
  const bgColor = tone === 'white' ? 'var(--color-surface)' : 
                  tone === 'sage' ? 'var(--color-surface-soft)' : 
                  tone === 'green' ? 'var(--color-primary-pale)' : 'var(--color-surface)'
                  
  return (
    <div className={`rounded-2xl p-6 ${className}`} style={{ backgroundColor: bgColor, border: '1px solid var(--color-border)' }}>
      {children}
    </div>
  )
}

export function ActionButton({ children, icon: Icon, onClick, variant = 'primary', className = '' }) {
  const variants = {
    primary: { bg: 'var(--color-primary)', text: 'var(--color-ink)', hover: 'var(--color-primary-hover)' },
    outline: { bg: 'var(--color-surface)', text: 'var(--color-ink)', hover: 'var(--color-surface-soft)', border: '1px solid var(--color-border)' },
  }
  const style = variants[variant] || variants.primary
  
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all ${className}`}
      style={{ backgroundColor: style.bg, color: style.text, border: style.border }}
      onMouseEnter={(e) => { if (style.hover) e.currentTarget.style.backgroundColor = style.hover }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = style.bg }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

export function MetricCard({ icon: Icon, title, value, change, note, tone = 'green' }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-mute)' }}>{title}</p>
          <p className="text-2xl font-black tracking-tight" style={{ color: 'var(--color-ink)' }}>{value}</p>
        </div>
        <IconTile icon={Icon} tone={tone} />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Badge tone={tone === 'red' ? 'red' : 'green'}>{change}</Badge>
        {note && <span className="text-xs" style={{ color: 'var(--color-mute)' }}>{note}</span>}
      </div>
    </Card>
  )
}

export function RoundIconButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0"
      style={{ backgroundColor: 'var(--color-surface-soft)' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-pale)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)'}
    >
      <ArrowRight size={16} style={{ color: 'var(--color-ink)' }} />
    </button>
  )
}

export function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-colors"
      style={{ backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-surface-soft)', border: !checked ? '1px solid var(--color-border)' : 'none' }}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-fade-in" 
        style={{ backgroundColor: 'var(--color-surface)' }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 px-6 py-4 border-b" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--color-ink)' }}>{title}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'var(--color-surface-soft)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-pale)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)'}>
              ✕
            </button>
          </div>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

export function FormGroup({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-ink)' }}>{label}</label>
      {children}
    </div>
  )
}

export function Input({ type = 'text', value, onChange, placeholder, required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-ink)' }}
    />
  )
}

export function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition appearance-none"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-ink)' }}
    >
      {children}
    </select>
  )
}

export function SectionHeader({ eyebrow, title, lede, action }) {
  return (
    <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)' }}>{eyebrow}</p>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-none mb-3" style={{ color: 'var(--color-ink)' }}>{title}</h1>
        {lede && <p className="text-base max-w-xl" style={{ color: 'var(--color-body)' }}>{lede}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}