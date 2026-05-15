// src/App.jsx
import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import DashboardPage from './pages/Dashboard'
import TransactionsPage from './pages/Transactions'
import AnalyticsPage from './pages/Analytics'
import RecurringPage from './pages/Recurring'
import AIAssistantPage from './pages/AIAssistant'
import SettingsPage from './pages/Settings'

// Shared initial transactions
const INITIAL_TRANSACTIONS = [
  { id: 1, name: 'Freelance Payment', detail: 'Payment received', category: 'Income', date: '2024-05-20', formattedDate: 'May 20, 2024', amount: 2500000, formattedAmount: '+Rp2.500.000', positive: true },
  { id: 2, name: 'Spotify Premium', detail: 'Monthly subscription', category: 'Entertainment', date: '2024-05-20', formattedDate: 'May 20, 2024', amount: -59000, formattedAmount: '-Rp59.000', positive: false },
  { id: 3, name: 'Coffee Shop', detail: 'Food & Drink', category: 'Food & Drink', date: '2024-05-19', formattedDate: 'May 19, 2024', amount: -45000, formattedAmount: '-Rp45.000', positive: false },
  { id: 4, name: 'Groceries', detail: 'Supermarket', category: 'Shopping', date: '2024-05-18', formattedDate: 'May 18, 2024', amount: -230000, formattedAmount: '-Rp230.000', positive: false },
  { id: 5, name: 'SeaBank Interest', detail: 'Interest received', category: 'Income', date: '2024-05-18', formattedDate: 'May 18, 2024', amount: 12450, formattedAmount: '+Rp12.450', positive: true },
  { id: 6, name: 'Electricity Bill', detail: 'PLN', category: 'Bills', date: '2024-05-15', formattedDate: 'May 15, 2024', amount: -450000, formattedAmount: '-Rp450.000', positive: false },
]

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [sharedTransactions, setSharedTransactions] = useState(INITIAL_TRANSACTIONS)

  const handleNavigate = (label) => setActivePage(label)

  const handleAddTransaction = (t) => setSharedTransactions(prev => [t, ...prev])
  const handleDeleteTransaction = (id) => setSharedTransactions(prev => prev.filter(t => t.id !== id))

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage transactions={sharedTransactions} onAddTransaction={handleAddTransaction} onNavigate={handleNavigate} />
      case 'Transactions':
        return <TransactionsPage transactions={sharedTransactions} onAddTransaction={handleAddTransaction} onDeleteTransaction={handleDeleteTransaction} />
      case 'Analytics':
        return <AnalyticsPage />
      case 'Recurring':
        return <RecurringPage />
      case 'AI Assistant':
        return <AIAssistantPage />
      case 'Settings':
        return <SettingsPage />
      default:
        return <DashboardPage transactions={sharedTransactions} onAddTransaction={handleAddTransaction} onNavigate={handleNavigate} />
    }
  }

  return (
    // ── App shell: sage canvas background ──
    <div className="min-h-screen bg-surface-soft">
      <div className="flex gap-6 p-6 max-w-350 mx-auto">

        {/* ── Sidebar ── */}
        <Sidebar activePage={activePage} onNavigate={handleNavigate} />

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col gap-6 animate-fade-in">
            {renderPage()}
          </div>
        </main>

      </div>
    </div>
  )
}
