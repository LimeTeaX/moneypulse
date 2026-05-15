// src/components/layout/Sidebar.jsx
import {
  BarChart3, Bot, LayoutDashboard, RefreshCw, Settings, TrendingUp, ArrowUpRight
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard },
  { label: 'Transactions', icon: TrendingUp },
  { label: 'Analytics',    icon: BarChart3 },
  { label: 'Recurring',    icon: RefreshCw },
  { label: 'AI Assistant', icon: Bot },
  { label: 'Settings',     icon: Settings },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
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

      {/* Balance Card */}
      <div className="mt-4 bg-surface-soft rounded-2xl p-4 shrink-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-mute mb-1">Current Balance</p>
        <p className="text-2xl font-black tracking-tight text-ink leading-none">Rp12.4M</p>
        <div className="flex items-center gap-1.5 mt-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <ArrowUpRight size={13} className="text-ink" />
          </div>
          <span className="text-xs font-semibold text-positive">+12.5% this month</span>
        </div>
      </div>
    </aside>
  )
}