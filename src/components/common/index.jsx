// src/components/common/index.jsx
// ─────────────────────────────────────────────
// All reusable UI primitives — 100% Tailwind
// Modal with blur overlay + body scroll lock
// ─────────────────────────────────────────────

import { useEffect } from 'react'
import { ArrowRight, X } from 'lucide-react'

// ─────────────────────────────────────────────
// Modal Component with blur overlay
// ─────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-9999 p-4" 
      onClick={onClose}
    >
      <div 
        className="rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto animate-fade-in shadow-2xl" 
        style={{ backgroundColor: 'var(--color-surface)' }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 px-6 py-4 border-b" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--color-ink)' }}>{title}</h2>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              style={{ backgroundColor: 'var(--color-surface-soft)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-pale)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)'}
            >
              ✕
            </button>
          </div>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}
// ─────────────────────────────────────────────
// Badge Component
// ─────────────────────────────────────────────
export function Badge({ children, tone = 'green' }) {
  const colors = {
    green: { bg: '#e2f6d5', text: '#2ead4b' },
    red: { bg: '#fee3e3', text: '#d03238' },
    gray: { bg: '#f0f2ef', text: '#868685' },
    blue: { bg: '#e7edff', text: '#3b82f6' },
    orange: { bg: '#fff0dc', text: '#f97316' },
    yellow: { bg: '#fef3c7', text: '#d97706' },
  }
  const color = colors[tone] || colors.green
  
  return (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold" 
      style={{ backgroundColor: color.bg, color: color.text }}>
      {children}
    </span>
  )
}

// ─────────────────────────────────────────────
// IconTile Component
// ─────────────────────────────────────────────
export function IconTile({ icon: Icon, tone = 'green', size = 20 }) {
  const colors = {
    green: { bg: '#e2f6d5', text: '#2ead4b' },
    red: { bg: '#fee3e3', text: '#d03238' },
    gray: { bg: '#f0f2ef', text: '#868685' },
    blue: { bg: '#e7edff', text: '#3b82f6' },
    orange: { bg: '#fff0dc', text: '#f97316' },
  }
  const color = colors[tone] || colors.green
  
  return (
    <div className="flex items-center justify-center rounded-xl w-10 h-10 shrink-0" style={{ backgroundColor: color.bg }}>
      <Icon size={size} style={{ color: color.text }} />
    </div>
  )
}

// ─────────────────────────────────────────────
// Card Component
// ─────────────────────────────────────────────
export function Card({ children, className = '', tone = 'white' }) {
  const bgColor = tone === 'white' ? '#ffffff' : 
                  tone === 'sage' ? '#e8ebe6' : 
                  tone === 'green' ? '#e2f6d5' : '#ffffff'
                  
  return (
    <div className={`rounded-2xl p-6 ${className}`} style={{ backgroundColor: bgColor, border: '1px solid rgba(14, 15, 12, 0.08)' }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
// ActionButton Component
// ─────────────────────────────────────────────
export function ActionButton({ children, icon: Icon, onClick, variant = 'primary', className = '' }) {
  const variants = {
    primary: { bg: '#9fe870', text: '#0e0f0c', hover: '#cdffad' },
    outline: { bg: '#ffffff', text: '#0e0f0c', hover: '#e8ebe6', border: '1px solid rgba(14, 15, 12, 0.08)' },
  }
  const style = variants[variant] || variants.primary
  
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${className}`}
      style={{ backgroundColor: style.bg, color: style.text, border: style.border }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = style.hover}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = style.bg}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

// ─────────────────────────────────────────────
// MetricCard Component
// ─────────────────────────────────────────────
export function MetricCard({ icon: Icon, title, value, change, note, tone = 'green' }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#868685' }}>{title}</p>
          <p className="text-2xl font-black tracking-tight" style={{ color: '#0e0f0c' }}>{value}</p>
        </div>
        <IconTile icon={Icon} tone={tone === 'red' ? 'red' : 'green'} />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Badge tone={tone === 'red' ? 'red' : 'green'}>{change}</Badge>
        {note && <span className="text-xs" style={{ color: '#868685' }}>{note}</span>}
      </div>
    </Card>
  )
}

// ─────────────────────────────────────────────
// RoundIconButton Component
// ─────────────────────────────────────────────
export function RoundIconButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer"
      style={{ backgroundColor: '#f0f2ef' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2f6d5'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f2ef'}
    >
      <ArrowRight size={16} style={{ color: '#0e0f0c' }} />
    </button>
  )
}

// ─────────────────────────────────────────────
// Toggle Component
// ─────────────────────────────────────────────
export function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
      style={{ backgroundColor: checked ? '#9fe870' : '#e8ebe6', border: !checked ? '1px solid rgba(14, 15, 12, 0.08)' : 'none' }}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

// ─────────────────────────────────────────────
// SectionHeader Component
// ─────────────────────────────────────────────
export function SectionHeader({ eyebrow, title, lede, action }) {
  return (
    <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#9fe870' }}>{eyebrow}</p>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-none mb-3" style={{ color: '#0e0f0c' }}>{title}</h1>
        {lede && <p className="text-base max-w-xl" style={{ color: '#454745' }}>{lede}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────
// FormGroup Component
// ─────────────────────────────────────────────
export function FormGroup({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1.5" style={{ color: '#0e0f0c' }}>{label}</label>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
// Input Component
// ─────────────────────────────────────────────
export function Input({ type = 'text', value, onChange, placeholder, required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
      style={{ backgroundColor: '#ffffff', border: '1px solid rgba(14, 15, 12, 0.08)', color: '#0e0f0c' }}
    />
  )
}

// ─────────────────────────────────────────────
// Select Component
// ─────────────────────────────────────────────
export function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition appearance-none cursor-pointer"
      style={{ backgroundColor: '#ffffff', border: '1px solid rgba(14, 15, 12, 0.08)', color: '#0e0f0c' }}
    >
      {children}
    </select>
  )
}