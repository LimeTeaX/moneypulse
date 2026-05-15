// src/components/layout/Sidebar.jsx
// ─────────────────────────────────────────────
// Sidebar navigation — with real balance from Supabase & Logout confirmation
// Full Tailwind, sticky, scrollable
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import {
  BarChart3, Bot, LayoutDashboard, RefreshCw, Settings, TrendingUp, ArrowUpRight,
  LogOut, X
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard },
  { label: 'Transactions', icon: TrendingUp },
  { label: 'Analytics',    icon: BarChart3 },
  { label: 'Recurring',    icon: RefreshCw },
  { label: 'AI Assistant', icon: Bot },
  { label: 'Settings',     icon: Settings },
]

// ─────────────────────────────────────────────
// Modal Konfirmasi Logout
// ─────────────────────────────────────────────
function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black tracking-tight text-ink">Confirm Logout</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-soft hover:bg-primary-pale flex items-center justify-center">
            <X size={18} />
          </button>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <LogOut size={28} className="text-danger" />
          </div>
          <p className="text-ink font-semibold mb-2">Are you sure you want to logout?</p>
          <p className="text-mute text-sm mb-6">You will need to sign in again to access your account.</p>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ activePage, onNavigate }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [totalBalance, setTotalBalance] = useState(0)
  const [balanceChange, setBalanceChange] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // ─── Fetch current balance from Supabase ───
  useEffect(() => {
    if (!user) return
    fetchBalance()
  }, [user])

  const fetchBalance = async () => {
    setLoading(true)
    
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('amount, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching balance:', error)
      setLoading(false)
      return
    }

    const balance = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
    setTotalBalance(balance)

    // Calculate percentage change from last month
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    let currentMonthTotal = 0
    let lastMonthTotal = 0

    transactions?.forEach(t => {
      const date = new Date(t.date)
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        currentMonthTotal += t.amount
      }
      if (date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear) {
        lastMonthTotal += t.amount
      }
    })

    if (lastMonthTotal !== 0) {
      const change = ((currentMonthTotal - lastMonthTotal) / Math.abs(lastMonthTotal)) * 100
      setBalanceChange(change)
    } else if (currentMonthTotal !== 0) {
      setBalanceChange(100)
    } else {
      setBalanceChange(0)
    }

    setLoading(false)
  }

  const formatBalance = (balance) => {
    if (balance >= 1000000000) {
      return `Rp${(balance / 1000000000).toFixed(1)}B`
    } else if (balance >= 1000000) {
      return `Rp${(balance / 1000000).toFixed(1)}M`
    } else if (balance >= 1000) {
      return `Rp${(balance / 1000).toFixed(0)}K`
    }
    return `Rp${balance.toLocaleString('id-ID')}`
  }

  const formatChange = (change) => {
    const sign = change > 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleConfirmLogout = async () => {
    await signOut()
    setShowLogoutModal(false)
    navigate('/')
    // Navigate to landing page after logout
    window.location.href = '/'
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  return (
    <>
      <aside className="w-64 shrink-0 bg-surface rounded-2xl flex flex-col p-5 gap-1 sticky top-6 h-[calc(100vh-48px)] overflow-y-auto">
        {/* Logo - Brand */}
        <div className="flex items-center gap-3 px-3 py-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center font-black text-ink text-base select-none">
            M
          </div>
          <div>
            <p className="font-black text-lg text-ink leading-none">MoneyPulse</p>
            <p className="text-[11px] text-mute leading-none mt-1">Personal Finance OS</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const isActive = activePage === label
            return (
              <button
                key={label}
                onClick={() => onNavigate(label)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left w-full transition-colors shrink-0
                  ${isActive
                    ? 'bg-primary text-ink'
                    : 'text-body hover:bg-surface-soft hover:text-ink'
                  }
                `}
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Current Balance Card - Connected to Supabase */}
        <div className="mt-4 bg-surface-soft rounded-2xl p-4 shrink-0">
          {loading ? (
            <div className="flex justify-center py-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-mute">Current Balance</p>
                <ArrowUpRight size={14} className="text-primary" />
              </div>
              <p className="text-2xl font-black tracking-tight text-ink leading-none">
                {formatBalance(totalBalance)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <ArrowUpRight size={13} className="text-ink" />
                </div>
                <span className={`text-xs font-semibold ${balanceChange >= 0 ? 'text-positive' : 'text-danger'}`}>
                  {formatChange(balanceChange)} this month
                </span>
              </div>
            </>
          )}
        </div>

        {/* ────────────────────────────────────────── */}
        {/* Logout Button */}
        {/* ────────────────────────────────────────── */}
        <button
          onClick={handleLogoutClick}
          className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left w-full transition-colors text-danger hover:bg-red-50"
        >
          <LogOut size={18} className="shrink-0" />
          Logout
        </button>
      </aside>

      {/* Modal Konfirmasi Logout */}
      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  )
}