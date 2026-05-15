// src/components/common/index.jsx
// All reusable UI primitives — 100% Tailwind, zero custom CSS

import { ArrowRight } from 'lucide-react'
export { Toast, useToast } from './Toast'

// ─────────────────────────────────────────────
// Badge
export function Badge({ children, tone = 'green' }) {
  const toneMap = {
    green:  'bg-primary-pale text-positive-deep',
    red:    'bg-red-50 text-danger',
    gray:   'bg-surface-soft text-body',
    blue:   'bg-blue-50 text-blue-700',
    orange: 'bg-orange-50 text-orange-700',
    yellow: 'bg-yellow-50 text-yellow-700',
  }
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${toneMap[tone] ?? toneMap.green}`}>
      {children}
    </span>
  )
}

// ─────────────────────────────────────────────
// IconTile
export function IconTile({ icon: Icon, tone = 'green', size = 20 }) {
  const toneMap = {
    green:  'bg-primary-pale text-positive',
    red:    'bg-red-50 text-danger',
    gray:   'bg-surface-soft text-mute',
    blue:   'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-500',
  }
  return (
    <div className={`flex items-center justify-center rounded-xl w-10 h-10 shrink-0 ${toneMap[tone] ?? toneMap.green}`}>
      <Icon size={size} />
    </div>
  )
}

// ─────────────────────────────────────────────
// Card
export function Card({ children, className = '', tone = 'white' }) {
  const toneMap = {
    white:  'bg-surface',
    sage:   'bg-surface-soft',
    green:  'bg-primary-pale',
    dark:   'bg-ink text-primary',
  }
  return (
    <div className={`rounded-2xl p-6 ${toneMap[tone] ?? toneMap.white} ${className}`}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
// ActionButton
export function ActionButton({ children, icon: Icon, onClick, variant = 'primary', className = '' }) {
  const variantMap = {
    primary:   'bg-primary hover:bg-primary-hover text-ink font-semibold',
    secondary: 'bg-surface-soft hover:bg-primary-pale text-ink font-semibold',
    outline:   'bg-surface border border-ink/10 hover:bg-surface-soft text-ink font-semibold',
  }
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm transition-colors ${variantMap[variant] ?? variantMap.primary} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

// ─────────────────────────────────────────────
// MetricCard
export function MetricCard({ icon: Icon, title, value, change, note, tone = 'green' }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-mute mb-1">{title}</p>
          <p className="text-2xl font-black tracking-tight text-ink">{value}</p>
        </div>
        <IconTile icon={Icon} tone={tone === 'red' ? 'red' : 'green'} />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Badge tone={tone === 'red' ? 'red' : 'green'}>{change}</Badge>
        {note && <span className="text-xs text-mute">{note}</span>}
      </div>
    </Card>
  )
}

// ─────────────────────────────────────────────
// RoundIconButton
export function RoundIconButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-full bg-surface-soft hover:bg-primary-pale flex items-center justify-center transition-colors shrink-0"
    >
      <ArrowRight size={16} />
    </button>
  )
}

// ─────────────────────────────────────────────
// Toggle
export function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-surface-soft border border-ink/10'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

// ─────────────────────────────────────────────
// SectionHeader
export function SectionHeader({ eyebrow, title, lede, action }) {
  return (
    <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">{eyebrow}</p>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-ink leading-none mb-3">{title}</h1>
        {lede && <p className="text-base text-body max-w-xl">{lede}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────
// Modal — FIXED dengan sticky header kayak navbar
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header — kayak navbar, ga transparan */}
        <div className="sticky top-0 z-10 bg-surface border-b border-ink/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-ink">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-soft hover:bg-primary-pale flex items-center justify-center text-ink transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// FormGroup
export function FormGroup({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-ink mb-1.5">{label}</label>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
// Input
export function Input({ type = 'text', value, onChange, placeholder, required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
    />
  )
}

// ─────────────────────────────────────────────
// Select
export function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition appearance-none"
    >
      {children}
    </select>
  )
}