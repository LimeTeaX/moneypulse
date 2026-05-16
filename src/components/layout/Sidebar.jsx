import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, BarChart3, RefreshCw, Bot, Settings, LogOut, ArrowUpRight, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Badge, IconTile } from '../common'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Transactions', icon: TrendingUp },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Recurring', icon: RefreshCw },
  { label: 'AI Assistant', icon: Bot },
  { label: 'Settings', icon: Settings },
]

function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--color-ink)' }}>Confirm Logout</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-soft)' }}>✕</button>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <LogOut size={28} className="text-danger" />
          </div>
          <p className="font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>Are you sure you want to logout?</p>
          <p className="text-sm mb-6" style={{ color: 'var(--color-mute)' }}>You will need to sign in again to access your account.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-danger text-white text-sm font-semibold">Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ activePage, onNavigate }) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [totalBalance, setTotalBalance] = useState(0)
  const [balanceChange, setBalanceChange] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    if (user) fetchBalance()
  }, [user])

  const fetchBalance = async () => {
    setLoading(true)
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('amount, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (!error && transactions) {
      const balance = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      setTotalBalance(balance)
      
      // Calculate change from last month
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      let currentMonthTotal = 0
      let lastMonthTotal = 0
      
      transactions.forEach(t => {
        const date = new Date(t.date)
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) currentMonthTotal += t.amount
        else if (date.getMonth() === currentMonth - 1 && date.getFullYear() === currentYear) lastMonthTotal += t.amount
        else if (currentMonth === 0 && date.getMonth() === 11 && date.getFullYear() === currentYear - 1) lastMonthTotal += t.amount
      })
      
      setBalanceChange(lastMonthTotal === 0 ? 0 : ((currentMonthTotal - lastMonthTotal) / Math.abs(lastMonthTotal)) * 100)
    }
    setLoading(false)
  }

  const formatBalance = (balance) => {
    if (balance >= 1000000000) return `Rp${(balance / 1000000000).toFixed(1)}B`
    if (balance >= 1000000) return `Rp${(balance / 1000000).toFixed(1)}M`
    if (balance >= 1000) return `Rp${(balance / 1000).toFixed(0)}K`
    return `Rp${balance.toLocaleString('id-ID')}`
  }

  const handleLogout = () => setShowLogoutModal(true)
  const handleConfirmLogout = async () => {
    await signOut()
    setShowLogoutModal(false)
    navigate('/')
  }

  return (
    <>
      <aside className="w-64 shrink-0 rounded-2xl flex flex-col p-5 gap-1 sticky top-6 h-[calc(100vh-48px)] overflow-y-auto" 
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        
        <div className="flex items-center gap-3 px-3 py-3 mb-4">
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base" 
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-ink)' }}>M</div>
          <div>
            <p className="font-black text-lg leading-none" style={{ color: 'var(--color-ink)' }}>MoneyPulse</p>
            <p className="text-[11px] leading-none mt-1" style={{ color: 'var(--color-mute)' }}>Personal Finance OS</p>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const isActive = activePage === label
            return (
              <button key={label} onClick={() => onNavigate(label)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left w-full transition-colors shrink-0"
                style={{ backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', color: isActive ? 'var(--color-ink)' : 'var(--color-body)' }}>
                <Icon size={18} className="shrink-0" />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="mt-4 rounded-2xl p-4 shrink-0" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
          {loading ? (
            <div className="flex justify-center py-2"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-mute)' }}>Current Balance</p>
                <ArrowUpRight size={14} style={{ color: 'var(--color-primary)' }} />
              </div>
              <p className="text-2xl font-black tracking-tight leading-none" style={{ color: 'var(--color-ink)' }}>{formatBalance(totalBalance)}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                  <ArrowUpRight size={13} style={{ color: 'var(--color-ink)' }} />
                </div>
                <span className="text-xs font-semibold" style={{ color: balanceChange >= 0 ? 'var(--color-positive)' : 'var(--color-danger)' }}>
                  {balanceChange >= 0 ? '+' : ''}{balanceChange.toFixed(1)}% this month
                </span>
              </div>
            </>
          )}
        </div>

        <button onClick={handleLogout}
          className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left w-full transition-colors"
          style={{ color: 'var(--color-danger)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <LogOut size={18} className="shrink-0" />
          Logout
        </button>
      </aside>

      <LogoutConfirmModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleConfirmLogout} />
    </>
  )
}