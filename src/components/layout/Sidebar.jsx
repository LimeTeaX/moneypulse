// src/components/layout/Sidebar.jsx
import {
  ArrowLeftRight,
  BarChart3,
  Bot,
  LayoutDashboard,
  Repeat,
  Settings,
  TrendingUp,
} from 'lucide-react'

const navigation = [
  ['Dashboard', LayoutDashboard],
  ['Transactions', ArrowLeftRight],
  ['Analytics', BarChart3],
  ['Recurring', Repeat],
  ['AI Assistant', Bot],
  ['Settings', Settings],
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar-panel">
      <div className="brand-lockup">
        <div className="logo-mark">M</div>
        <div>
          <h1>MoneyPulse</h1>
          <p>Personal Finance OS</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(([label, Icon]) => (
          <button
            className={activePage === label ? 'active' : ''}
            key={label}
            onClick={() => onNavigate(label)}
            type="button"
          >
            <Icon size={23} strokeWidth={2.4} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="balance-card">
        <p>Current Balance</p>
        <h2>Rp12.4M</h2>
        <span>+12.5% this month</span>
        <div>
          <TrendingUp size={24} />
        </div>
      </div>
    </aside>
  )
}