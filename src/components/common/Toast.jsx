import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react'

export function Toast({ message, type = 'success', isOpen, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  const config = {
    success: { icon: CheckCircle, color: 'var(--color-positive)' },
    error: { icon: XCircle, color: 'var(--color-danger)' },
    info: { icon: Info, color: 'var(--color-primary)' },
  }

  const { icon: Icon, color } = config[type] || config.success

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg" 
        style={{ backgroundColor: 'var(--color-surface)', border: `1px solid ${color}` }}>
        <Icon size={18} style={{ color }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{message}</p>
        <button onClick={onClose} className="ml-2" style={{ color: 'var(--color-mute)' }}>
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type })
  }

  const hideToast = () => {
    setToast({ isOpen: false, message: '', type: 'success' })
  }

  return { toast, showToast, hideToast }
}