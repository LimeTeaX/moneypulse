// src/components/layout/Sidebar.jsx
import { ChevronLeft, ChevronRight, LogOut, LayoutDashboard, TrendingUp, BarChart3, RefreshCw, Bot, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Transactions', icon: TrendingUp },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Recurring', icon: RefreshCw },
  { label: 'AI Assistant', icon: Bot },
  { label: 'Settings', icon: Settings },
]

export default function Sidebar({ activePage, onNavigate, isCollapsed, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-surface flex flex-col transition-all duration-300 z-50 shadow-lg
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
        style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
      >
        {/* Logo + Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center py-5' : 'justify-between px-4 py-5'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" 
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-ink)' }}>
                M
              </div>
              <span className="font-black text-base" style={{ color: 'var(--color-ink)' }}>MoneyPulse</span>
            </div>
          )}
          
          {/* Toggle button */}
          <button 
            onClick={onToggle}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-surface-soft cursor-pointer shrink-0"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-soft)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {isCollapsed ? <ChevronRight size={16} style={{ color: 'var(--color-mute)' }} /> : <ChevronLeft size={16} style={{ color: 'var(--color-mute)' }} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const isActive = activePage === label
            return (
              <button 
                key={label} 
                onClick={() => onNavigate(label)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all cursor-pointer
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                style={{ 
                  backgroundColor: isActive ? 'var(--color-primary-pale)' : 'transparent', 
                  color: isActive ? 'var(--color-positive)' : 'var(--color-body)',
                }}
                title={isCollapsed ? label : ''}
              >
                <Icon size={18} className="shrink-0" />
                {!isCollapsed && label}
              </button>
            )
          })}
        </nav>

        {/* Logout button di bawah */}
        <div className="px-2 pb-4 mt-auto">
          <button 
            onClick={() => {/* handle logout */}}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${isCollapsed ? 'justify-center' : ''}
            `}
            style={{ color: 'var(--color-danger)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(208, 50, 56, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  )
}