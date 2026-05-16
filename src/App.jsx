// src/App.jsx
import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Sidebar from './components/layout/Sidebar'
import LandingPage from './pages/Landing'
import AuthPage from './pages/Auth'
import AuthCallback from './pages/AuthCallback'
import DashboardPage from './pages/Dashboard'
import TransactionsPage from './pages/Transactions'
import AnalyticsPage from './pages/Analytics'
import RecurringPage from './pages/Recurring'
import AIAssistantPage from './pages/AIAssistant'
import SettingsPage from './pages/Settings'

function DashboardLayout({ children, activePage, onNavigate }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-surface-soft">
      <div className="flex">
        <Sidebar 
          activePage={activePage} 
          onNavigate={onNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : ''}`}>
          <div className="p-6">
            <div className="flex flex-col gap-6 animate-fade-in max-w-350 mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
export default function App() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState('Dashboard')

  const handleNavigate = (page) => {
    if (page === 'landing') {
      navigate('/')
    } else if (page === 'auth') {
      navigate('/auth')
    } else {
      setActivePage(page)
      navigate('/dashboard')
    }
  }

  const handleDashboardNavigate = (page) => {
    setActivePage(page)
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={
        user ? (
          <DashboardLayout activePage={activePage} onNavigate={handleDashboardNavigate}>
            {activePage === 'Dashboard' && <DashboardPage onNavigate={handleDashboardNavigate} />}
            {activePage === 'Transactions' && <TransactionsPage onNavigate={handleDashboardNavigate} />}
            {activePage === 'Analytics' && <AnalyticsPage />}
            {activePage === 'Recurring' && <RecurringPage />}
            {activePage === 'AI Assistant' && <AIAssistantPage />}
            {activePage === 'Settings' && <SettingsPage />}
          </DashboardLayout>
        ) : <Navigate to="/" />
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}