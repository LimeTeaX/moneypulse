// src/components/common/Toast.jsx
// ─────────────────────────────────────────────
// Toast Notification Component
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react'

const toastTypes = {
  success: { icon: CheckCircle, bg: 'bg-positive/10 border-positive/20', text: 'text-positive' },
  error: { icon: XCircle, bg: 'bg-danger/10 border-danger/20', text: 'text-danger' },
  warning: { icon: AlertCircle, bg: 'bg-orange-50 border-orange-200', text: 'text-orange-600' },
  info: { icon: Info, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600' },
}

export function Toast({ message, type = 'success', isOpen, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  const { icon: Icon, bg, text } = toastTypes[type] || toastTypes.success

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bg}`}>
        <Icon size={18} className={text} />
        <p className="text-sm font-medium text-ink">{message}</p>
        <button onClick={onClose} className="ml-2 text-mute hover:text-ink transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Hook untuk menggunakan toast
// ─────────────────────────────────────────────
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