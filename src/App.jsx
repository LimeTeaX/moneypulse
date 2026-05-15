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

// ─────────────────────────────────────────────
// Layout untuk halaman yang butuh sidebar
// ─────────────────────────────────────────────
function DashboardLayout({ children, activePage, onNavigate }) {
  return (
    <div className="min-h-screen bg-surface-soft">
      <div className="flex gap-6 p-6 max-w-[1400px] mx-auto">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
        <main className="flex-1 min-w-0">
          <div className="flex flex-col gap-6 animate-fade-in">
            {children}
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
      {/* Landing Page - redirect ke dashboard kalo udah login */}
      <Route 
        path="/" 
        element={
          !user ? <LandingPage onNavigate={handleNavigate} /> : <Navigate to="/dashboard" />
        } 
      />
      
      {/* Auth Page */}
      <Route 
        path="/auth" 
        element={
          !user ? <AuthPage onNavigate={handleNavigate} /> : <Navigate to="/dashboard" />
        } 
      />
      
      {/* Auth Callback untuk Google OAuth */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Dashboard & Protected Pages */}
      <Route 
        path="/dashboard" 
        element={
          user ? (
            <DashboardLayout activePage={activePage} onNavigate={handleDashboardNavigate}>
              {activePage === 'Dashboard' && <DashboardPage onNavigate={handleDashboardNavigate} />}
              {activePage === 'Transactions' && <TransactionsPage onNavigate={handleDashboardNavigate} />}
              {activePage === 'Analytics' && <AnalyticsPage />}
              {activePage === 'Recurring' && <RecurringPage />}
              {activePage === 'AI Assistant' && <AIAssistantPage />}
              {activePage === 'Settings' && <SettingsPage />}
            </DashboardLayout>
          ) : (
            <Navigate to="/" />
          )
        } 
      />
      
      {/* Fallback - redirect ke home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}