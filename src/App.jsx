// src/App.jsx
import { useState } from 'react'
import DashboardPage from './pages/Dashboard'
import TransactionsPage from './pages/Transactions'  // tambah ini
import Sidebar from './components/layout/Sidebar'

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [activeSetting, setActiveSetting] = useState('Profile')
  const [sharedTransactions, setSharedTransactions] = useState([
    // data transaksi awal...
  ])

  const navIntents = {
    Dashboard: { page: 'Dashboard', setting: 'Profile' },
    Transactions: { page: 'Transactions', setting: 'Profile' },
    Analytics: { page: 'Analytics', setting: 'Profile' },
    Recurring: { page: 'Recurring', setting: 'Profile' },
    'AI Assistant': { page: 'AI Assistant', setting: 'Profile' },
    Settings: { page: 'Settings', setting: 'Profile' },
  }

  const handleNavigate = (label) => {
    const target = navIntents[label]
    setActivePage(target.page)
    setActiveSetting(target.setting)
  }

  const handleAddTransaction = (newTransaction) => {
    setSharedTransactions([newTransaction, ...sharedTransactions])
  }

  const handleDeleteTransaction = (id) => {
    setSharedTransactions(sharedTransactions.filter(t => t.id !== id))
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <main className="main-panel">
        <div className="page-frame">
          {activePage === 'Dashboard' && <DashboardPage />}
          {activePage === 'Transactions' && (
            <TransactionsPage 
              transactions={sharedTransactions}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
        </div>
      </main>
    </div>
  )
}