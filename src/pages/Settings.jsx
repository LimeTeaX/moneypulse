// src/pages/Settings.jsx
// ─────────────────────────────────────────────
// Settings Page — Profile, Notifications, Appearance, Security, Accounts, Privacy, About
// Full Tailwind, semua functional, Toast notification
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import {
  User, Bell, Palette, Shield, CreditCard, Download, Info,
  ChevronRight, Check, RefreshCw, ExternalLink, Trash2,
  Camera, PenLine, LockKeyhole, Monitor, Smartphone, Laptop,
  Mail, Goal, ReceiptText, TrendingUp, Calendar, BadgeCheck,
  CircleCheck, Clock, FileText, SquareArrowOutUpRight, Sparkles,
  Plus, X, CheckCircle, XCircle
} from 'lucide-react'
import { Card, Toggle, Badge, ActionButton, IconTile, Input, Modal, FormGroup, Select } from '../components/common'

// ─────────────────────────────────────────────
// Toast Hook & Component (taruh di luar, sebelum SettingsPage)
// ─────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type })
  }

  const hideToast = () => {
    setToast({ isOpen: false, message: '', type: 'success' })
  }

  return { toast, showToast, hideToast }
}

function Toast({ isOpen, message, type, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const bgColor = type === 'success' ? 'bg-positive/10 border-positive/20' :
                  type === 'error' ? 'bg-danger/10 border-danger/20' :
                  'bg-blue-50 border-blue-200'
  
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : Info

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgColor}`}>
        <Icon size={18} className={type === 'success' ? 'text-positive' : type === 'error' ? 'text-danger' : 'text-blue-600'} />
        <p className="text-sm font-medium text-ink">{message}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Modal Add Account
// ─────────────────────────────────────────────
function AddAccountModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '', accountNumber: '', balance: '', type: 'Checking', emoji: '🏦'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.accountNumber || !formData.balance) {
      alert('Please fill all required fields')
      return
    }
    onAdd({
      ...formData,
      balance: parseFloat(formData.balance),
      status: 'active'
    })
    onClose()
    setFormData({ name: '', accountNumber: '', balance: '', type: 'Checking', emoji: '🏦' })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link New Account">
      <form onSubmit={handleSubmit}>
        <FormGroup label="Bank / Wallet Name *">
          <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Bank BCA, OVO" />
        </FormGroup>
        <FormGroup label="Account Number *">
          <Input required value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} placeholder="**** **** **** 1234" />
        </FormGroup>
        <FormGroup label="Balance (IDR) *">
          <Input type="number" required value={formData.balance} onChange={e => setFormData({ ...formData, balance: e.target.value })} placeholder="0" />
        </FormGroup>
        <FormGroup label="Account Type">
          <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
            <option value="Checking">Checking Account</option>
            <option value="Savings">Savings Account</option>
            <option value="E-Wallet">E-Wallet</option>
          </Select>
        </FormGroup>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">Link Account</button>
        </div>
      </form>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Modal Change Password
// ─────────────────────────────────────────────
function ChangePasswordModal({ isOpen, onClose, onChange, showToast }) {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      showToast('New password and confirm password do not match', 'error')
      return
    }
    if (passwords.new.length < 6) {
      showToast('Password must be at least 6 characters', 'error')
      return
    }
    onChange(passwords)
    onClose()
    setPasswords({ current: '', new: '', confirm: '' })
    showToast('Password changed successfully!', 'success')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit}>
        <FormGroup label="Current Password">
          <Input type="password" required value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
        </FormGroup>
        <FormGroup label="New Password">
          <Input type="password" required value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} />
        </FormGroup>
        <FormGroup label="Confirm New Password">
          <Input type="password" required value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
        </FormGroup>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">Update Password</button>
        </div>
      </form>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Profile Tab
// ─────────────────────────────────────────────
function ProfileTab({ showToast }) {
  const [prefs, setPrefs] = useState({ budgetAlerts: true, weeklySum: true, marketing: false })
  const [currency, setCurrency] = useState('IDR')
  const [language, setLanguage] = useState('English')
  const [dateFormat, setDateFormat] = useState('MMM DD, YYYY')

  const [profile, setProfile] = useState({
    name: 'Jackson M. Tambun',
    email: 'jackson.tambun@email.com',
    phone: '+62 812 3456 7890'
  })

  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' })

  const handleEditClick = () => {
    setEditForm({ name: profile.name, email: profile.email, phone: profile.phone })
    setShowEditModal(true)
  }

  const handleSaveProfile = () => {
    if (!editForm.name || !editForm.email || !editForm.phone) {
      showToast('Please fill all fields', 'error')
      return
    }
    setProfile({ name: editForm.name, email: editForm.email, phone: editForm.phone })
    setShowEditModal(false)
    showToast('Profile updated successfully!', 'success')
  }

  const handleCurrencyChange = () => {
    const newCurrency = currency === 'IDR' ? 'USD' : 'IDR'
    setCurrency(newCurrency)
    showToast(`Currency changed to ${newCurrency === 'IDR' ? 'Indonesian Rupiah' : 'US Dollar'}`, 'info')
  }

  const handleLanguageChange = () => {
    const newLanguage = language === 'English' ? 'Indonesia' : 'English'
    setLanguage(newLanguage)
    showToast(`Language changed to ${newLanguage}`, 'info')
  }

  const handleDateFormatChange = () => {
    const newFormat = dateFormat === 'MMM DD, YYYY' ? 'DD/MM/YYYY' : 'MMM DD, YYYY'
    setDateFormat(newFormat)
    showToast('Date format updated', 'info')
  }

  const handleToggle = (key, value) => {
    setPrefs(prev => ({ ...prev, [key]: value }))
    const labels = { budgetAlerts: 'Budget Alerts', weeklySum: 'Weekly Summary', marketing: 'Marketing Updates' }
    showToast(`${labels[key]} ${value ? 'enabled' : 'disabled'}`, 'info')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-black text-ink mb-0.5">Profile Information</h2>
          <p className="text-sm text-mute">Update your personal details and preferences.</p>
        </div>
        <ActionButton icon={PenLine} variant="outline" onClick={handleEditClick}>Edit Profile</ActionButton>
      </div>

      <div className="flex items-center gap-4 p-5 bg-surface-soft rounded-2xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-ink font-black text-2xl">{profile.name.charAt(0)}</div>
          <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-surface border border-ink/10 flex items-center justify-center text-xs"><Camera size={12} /></button>
        </div>
        <div>
          <h3 className="text-base font-black text-ink">{profile.name}</h3>
          <p className="text-sm text-mute">{profile.email}</p>
          <div className="flex gap-4 mt-1 text-xs text-mute"><span>📞 {profile.phone}</span><span>📅 Member since March 15, 2024</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="p-4 bg-surface-soft rounded-xl text-left hover:bg-primary-pale transition-colors" onClick={handleCurrencyChange}>
          <p className="text-xs text-mute font-semibold mb-1">Currency</p>
          <p className="text-sm font-semibold text-ink">{currency === 'IDR' ? 'Indonesian Rupiah (IDR)' : 'US Dollar (USD)'}</p>
        </button>
        <button className="p-4 bg-surface-soft rounded-xl text-left hover:bg-primary-pale transition-colors" onClick={handleLanguageChange}>
          <p className="text-xs text-mute font-semibold mb-1">Language</p>
          <p className="text-sm font-semibold text-ink">{language}</p>
        </button>
        <button className="p-4 bg-surface-soft rounded-xl text-left hover:bg-primary-pale transition-colors" onClick={handleDateFormatChange}>
          <p className="text-xs text-mute font-semibold mb-1">Date Format</p>
          <p className="text-sm font-semibold text-ink">{dateFormat}</p>
        </button>
      </div>

      <div>
        <h3 className="text-sm font-black text-ink mb-3">Preferences</h3>
        {[
          { key: 'budgetAlerts', label: 'Budget Alerts', sub: "Get notified when you're close to your budget limit." },
          { key: 'weeklySum', label: 'Weekly Summary', sub: 'Receive weekly financial summary.' },
          { key: 'marketing', label: 'Marketing Updates', sub: 'Receive news and updates from MoneyPulse.' },
        ].map(p => (
          <div key={p.key} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
            <div><p className="text-sm font-semibold text-ink">{p.label}</p><p className="text-xs text-mute">{p.sub}</p></div>
            <Toggle checked={prefs[p.key]} onChange={v => handleToggle(p.key, v)} />
          </div>
        ))}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black tracking-tight text-ink">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-full bg-surface-soft hover:bg-primary-pale flex items-center justify-center">✕</button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-semibold text-ink mb-1.5">Full Name</label><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
              <div><label className="block text-sm font-semibold text-ink mb-1.5">Email Address</label><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
              <div><label className="block text-sm font-semibold text-ink mb-1.5">Phone Number</label><input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-ink/10">
                <button onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Cancel</button>
                <button onClick={handleSaveProfile} className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Notifications Tab
// ─────────────────────────────────────────────
function NotificationsTab({ showToast }) {
  const [channels, setChannels] = useState({ inApp: true, email: true, push: true })
  const [notifs, setNotifs] = useState({ txAlerts: true, budgetAlerts: true, billReminders: true, savingsGoals: true, productUpdates: false })

  const handleSave = () => {
    showToast('Notification settings saved!', 'success')
  }

  const handleChannelToggle = (key, value) => {
    setChannels(prev => ({ ...prev, [key]: value }))
    const labels = { inApp: 'In-App', email: 'Email', push: 'Push' }
    showToast(`${labels[key]} notifications ${value ? 'enabled' : 'disabled'}`, 'info')
  }

  const handleNotifToggle = (key, value) => {
    setNotifs(prev => ({ ...prev, [key]: value }))
    const labels = { txAlerts: 'Transaction Alerts', budgetAlerts: 'Budget Alerts', billReminders: 'Bill Reminders', savingsGoals: 'Savings Goals', productUpdates: 'Product Updates' }
    showToast(`${labels[key]} ${value ? 'enabled' : 'disabled'}`, 'info')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-black text-ink mb-0.5">Manage your notifications.</h2>
          <p className="text-sm text-mute">Choose what updates you want to receive and how.</p>
        </div>
        <ActionButton onClick={handleSave}>Save Changes</ActionButton>
      </div>

      <div className="p-5 bg-surface-soft rounded-2xl">
        <h3 className="text-sm font-black text-ink mb-3">Notification Channels</h3>
        {[
          { key: 'inApp', label: 'In-App Notifications', sub: 'Receive alerts inside the MoneyPulse app.' },
          { key: 'email', label: 'Email Notifications', sub: 'Receive updates via your email.' },
          { key: 'push', label: 'Push Notifications', sub: 'Receive push notifications on your device.' },
        ].map(c => (
          <div key={c.key} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
            <div><p className="text-sm font-semibold text-ink">{c.label}</p><p className="text-xs text-mute">{c.sub}</p></div>
            <Toggle checked={channels[c.key]} onChange={v => handleChannelToggle(c.key, v)} />
          </div>
        ))}
      </div>

      <div className="p-5 bg-surface rounded-2xl border border-ink/5">
        <h3 className="text-sm font-black text-ink mb-3">Notification Preferences</h3>
        {[
          { key: 'txAlerts', label: 'Transaction Alerts', sub: 'Get notified about income, expenses, and transfers.' },
          { key: 'budgetAlerts', label: 'Budget Alerts', sub: "Get notified when you're close to or exceed your budget limit." },
          { key: 'billReminders', label: 'Bill Reminders', sub: 'Receive reminders before your bills are due.' },
          { key: 'savingsGoals', label: 'Savings Goals', sub: 'Get updates about your savings goal progress.' },
          { key: 'productUpdates', label: 'Product Updates', sub: 'Receive updates about new features and improvements.' },
        ].map(n => (
          <div key={n.key} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
            <div><p className="text-sm font-semibold text-ink">{n.label}</p><p className="text-xs text-mute">{n.sub}</p></div>
            <Toggle checked={notifs[n.key]} onChange={v => handleNotifToggle(n.key, v)} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Appearance Tab
// ─────────────────────────────────────────────
function AppearanceTab({ showToast }) {
  const [theme, setTheme] = useState('Light')
  const [accent, setAccent] = useState('#9fe870')
  const [compact, setCompact] = useState(false)
  const [animations, setAnimations] = useState(true)
  const [tips, setTips] = useState(true)

  const handleSave = () => {
    showToast('Appearance settings saved!', 'success')
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    showToast(`${newTheme} theme applied`, 'info')
  }

  const handleAccentChange = (newAccent) => {
    setAccent(newAccent)
    showToast('Accent color updated', 'info')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-black text-ink mb-0.5">Appearance Settings</h2>
          <p className="text-sm text-mute">Customize how MoneyPulse looks and feels.</p>
        </div>
        <ActionButton onClick={handleSave}>Save Changes</ActionButton>
      </div>

      <div className="p-5 bg-surface rounded-2xl border border-ink/5">
        <h3 className="text-sm font-black text-ink mb-3">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Light', icon: '☀️', desc: 'Clean and bright' },
            { name: 'Dark', icon: '🌙', desc: 'Easy on the eyes' },
            { name: 'System', icon: '🖥️', desc: 'Use system settings' }
          ].map(t => (
            <button key={t.name} onClick={() => handleThemeChange(t.name)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${theme === t.name ? 'border-primary bg-primary-pale' : 'border-ink/10 bg-surface-soft'}`}>
              {theme === t.name && <Check size={14} className="absolute top-2 right-2 text-positive" />}
              <span className="text-2xl">{t.icon}</span>
              <span className="text-sm font-semibold text-ink">{t.name}</span>
              <span className="text-xs text-mute">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 bg-surface-soft rounded-2xl">
        <h3 className="text-sm font-black text-ink mb-1">Primary Color</h3>
        <p className="text-xs text-mute mb-3">Choose your accent color.</p>
        <div className="flex gap-3">
          {[['#9fe870'], ['#3b82f6'], ['#a855f7'], ['#f97316'], ['#ec4899']].map(c => (
            <button key={c} onClick={() => handleAccentChange(c)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ background: c }}>
              {accent === c && <Check size={14} className="text-white" />}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 bg-surface rounded-2xl border border-ink/5">
        <h3 className="text-sm font-black text-ink mb-3">Display Preferences</h3>
        {[
          { label: 'Compact Mode', sub: 'Show more information in less space.', val: compact, set: setCompact },
          { label: 'Show Chart Animations', sub: 'Enable smooth animations in charts.', val: animations, set: setAnimations },
          { label: 'Show Financial Tips', sub: 'Display helpful tips on dashboard.', val: tips, set: setTips },
        ].map(p => (
          <div key={p.label} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
            <div><p className="text-sm font-semibold text-ink">{p.label}</p><p className="text-xs text-mute">{p.sub}</p></div>
            <Toggle checked={p.val} onChange={p.set} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Security Tab
// ─────────────────────────────────────────────
function SecurityTab({ showToast }) {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)

  const handleEnable2FA = () => {
    setShow2FAModal(false)
    showToast('2FA setup started! Check your email for verification code.', 'info')
  }

  const handleChangePassword = (passwords) => {
    console.log('Password changed:', passwords)
  }

  const handle2FA = () => {
    setShow2FAModal(true)
  }

  const handleSecurityCheck = () => {
    showToast('Security check initiated. Reviewing your account security...', 'info')
    setTimeout(() => {
      showToast('Security check completed! Your account is secure.', 'success')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-black text-ink mb-0.5">Security Overview</h2>
          <p className="text-sm text-mute">Keep your account and data protected.</p>
        </div>
        <ActionButton icon={Shield} onClick={handleSecurityCheck}>Security Check</ActionButton>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Password', value: 'Strong', tone: 'green' },
          { label: 'Two-Factor Auth', value: 'Active', tone: 'green' },
          { label: 'Active Sessions', value: '3 devices', tone: 'blue' },
          { label: 'Last Security Check', value: '2 days ago', tone: 'gray' },
        ].map(s => (
          <div key={s.label} className="p-4 bg-surface-soft rounded-xl">
            <p className="text-xs text-mute font-semibold mb-1">{s.label}</p>
            <p className={`text-sm font-black ${s.tone === 'green' ? 'text-positive' : s.tone === 'blue' ? 'text-blue-600' : 'text-mute'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="p-5 bg-surface rounded-2xl border border-ink/5">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-sm font-black text-ink">Password</h3><p className="text-xs text-mute">Update your password regularly.</p></div>
          <button onClick={() => setShowChangePassword(true)} className="text-sm font-semibold text-positive hover:underline">Change Password</button>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-mute mb-1"><span>Password Strength</span><span className="text-positive font-semibold">Strong</span></div>
          <div className="h-2 rounded-full bg-surface-soft overflow-hidden"><div className="h-full w-4/5 rounded-full bg-positive" /></div>
          <p className="text-xs text-mute mt-2">Last changed 2 months ago</p>
        </div>
      </div>

      <div className="p-5 bg-primary-pale rounded-2xl">
        <div className="flex items-start gap-3">
          <IconTile icon={Shield} tone="green" size={20} />
          <div className="flex-1"><p className="text-sm font-black text-positive">2FA is enabled</p><p className="text-xs text-body">Your account is protected with two-factor authentication.</p></div>
          <button onClick={handle2FA} className="text-sm font-semibold text-positive hover:underline flex items-center gap-1">Manage <ChevronRight size={14} /></button>
        </div>
      </div>

      <div className="p-5 bg-surface rounded-2xl border border-ink/5">
        <h3 className="text-sm font-black text-ink mb-3">Active Sessions</h3>
        {[
          { device: 'MacBook Pro', location: 'Jakarta, Indonesia', time: 'Current', icon: Laptop, current: true },
          { device: 'iPhone 14 Pro', location: 'Jakarta, Indonesia', time: '2 hours ago', icon: Smartphone, current: false },
          { device: 'Windows PC', location: 'Bandung, Indonesia', time: '1 day ago', icon: Monitor, current: false },
        ].map(s => (
          <div key={s.device} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
            <div className="flex items-center gap-3">
              <IconTile icon={s.icon} tone="gray" size={16} />
              <div><p className="text-sm font-semibold text-ink">{s.device}</p><p className="text-xs text-mute">{s.location}</p></div>
            </div>
            {s.current ? <Badge tone="green">Current</Badge> : <span className="text-xs text-mute">{s.time}</span>}
          </div>
        ))}
      </div>

      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} onChange={handleChangePassword} showToast={showToast} />

      <Modal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} title="Two-Factor Authentication">
        <p className="text-sm text-mute mb-4">Enable 2FA to add an extra layer of security to your account. A verification code will be sent to your email.</p>
        <div className="flex gap-3">
          <button onClick={() => setShow2FAModal(false)} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Cancel</button>
          <button onClick={handleEnable2FA} className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">Enable 2FA</button>
        </div>
      </Modal>
    </div>
  )
}

// ─────────────────────────────────────────────
// Accounts Tab
// ─────────────────────────────────────────────
function AccountsTab({ showToast }) {
  const [autoSync, setAutoSync] = useState(true)
  const [hideZero, setHideZero] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [accounts, setAccounts] = useState([
    { name: 'Bank BCA', accountNumber: '**** **** **** 1234', balance: 8450000, type: 'Checking', status: 'active', emoji: '🏦' },
    { name: 'Bank Mandiri', accountNumber: '**** **** **** 5678', balance: 3250000, type: 'Savings', status: 'active', emoji: '🏦' },
    { name: 'OVO', accountNumber: '**** **** **** 9012', balance: 520000, type: 'E-Wallet', status: 'active', emoji: '💜' },
    { name: 'ShopeePay', accountNumber: '**** **** **** 3456', balance: 180000, type: 'E-Wallet', status: 'inactive', emoji: '🧡' },
  ])

  const handleAddAccount = (newAccount) => {
    setAccounts([...accounts, { ...newAccount, status: 'active' }])
    showToast('Account linked successfully!', 'success')
  }

  const handleRefresh = () => {
    showToast('Refreshing all accounts...', 'info')
    setTimeout(() => {
      showToast('Accounts refreshed successfully!', 'success')
    }, 1500)
  }

  const totalBalance = accounts.filter(a => a.status === 'active').reduce((s, a) => s + a.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h2 className="text-lg font-black text-ink mb-0.5">Linked Accounts</h2><p className="text-sm text-mute">Connect your bank and financial accounts.</p></div>
        <ActionButton icon={Plus} variant="outline" onClick={() => setShowAddAccount(true)}>Link Account</ActionButton>
      </div>

      <div className="p-5 bg-surface rounded-2xl border border-ink/5">
        {accounts.map(a => (
          <div key={a.name} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-soft flex items-center justify-center text-xl">{a.emoji}</div>
              <div><p className="text-sm font-semibold text-ink">{a.name}</p><p className="text-xs text-mute">{a.accountNumber}</p></div>
            </div>
            <div className="text-right"><p className="text-sm font-semibold text-ink">Rp{a.balance.toLocaleString('id-ID')}</p><p className="text-xs text-mute">{a.type}</p></div>
            <Badge tone={a.status === 'active' ? 'green' : 'gray'}>{a.status === 'active' ? 'Active' : 'Inactive'}</Badge>
          </div>
        ))}
        <div className="pt-3 flex items-center justify-between"><p className="text-xs text-mute">Showing {accounts.length} accounts</p><button className="text-xs font-semibold text-positive hover:underline">View All →</button></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 bg-primary-pale rounded-2xl">
          <p className="text-xs text-mute font-semibold mb-2">Total Balance</p>
          <p className="text-2xl font-black text-ink">Rp{totalBalance.toLocaleString('id-ID')}</p>
          <p className="text-xs text-positive mt-1">+12.5% this month</p>
          <div className="mt-3 space-y-1 text-xs text-body">
            <div className="flex justify-between"><span>Active Accounts</span><span className="font-semibold">{accounts.filter(a => a.status === 'active').length}</span></div>
            <div className="flex justify-between"><span>Inactive Accounts</span><span className="font-semibold">{accounts.filter(a => a.status === 'inactive').length}</span></div>
            <div className="flex justify-between"><span>Last Updated</span><span className="font-semibold">2 min ago</span></div>
          </div>
        </div>

        <div className="p-5 bg-surface rounded-2xl border border-ink/5">
          <h3 className="text-sm font-black text-ink mb-3">Account Management</h3>
          <div className="flex items-center justify-between py-2.5 border-b border-ink/5">
            <div><p className="text-sm font-semibold text-ink">Auto Sync</p><p className="text-xs text-mute">Automatically sync your account data.</p></div>
            <Toggle checked={autoSync} onChange={setAutoSync} />
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-ink/5">
            <div><p className="text-sm font-semibold text-ink">Hide Zero Balance Accounts</p><p className="text-xs text-mute">Hide accounts with zero balance.</p></div>
            <Toggle checked={hideZero} onChange={setHideZero} />
          </div>
          <button onClick={handleRefresh} className="mt-3 flex items-center gap-2 text-xs font-semibold text-mute hover:text-ink"><RefreshCw size={13} /> Refresh All Accounts</button>
        </div>
      </div>

      <AddAccountModal isOpen={showAddAccount} onClose={() => setShowAddAccount(false)} onAdd={handleAddAccount} />
    </div>
  )
}

// ─────────────────────────────────────────────
// Data & Privacy Tab
// ─────────────────────────────────────────────
function PrivacyTab({ showToast }) {
  const handleExport = () => {
    showToast('Export started. You will receive an email when ready.', 'info')
    setTimeout(() => {
      showToast('Your data export is ready! Check your email.', 'success')
    }, 2000)
  }

  const handleDelete = () => {
    if (confirm('Are you sure? This action cannot be undone!')) {
      showToast('Account deletion request submitted. We\'re sad to see you go.', 'info')
    }
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-lg font-black text-ink mb-0.5">Data & Privacy Overview</h2><p className="text-sm text-mute">You're in control of your data. Manage, export, or delete your information anytime.</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Data Categories', value: '12' }, { label: 'Data Encrypted', value: '100%' }, { label: "You're in Control", value: '✓' }, { label: 'Last Export', value: 'May 15, 2024' }].map(s => (
          <div key={s.label} className="p-4 bg-surface-soft rounded-xl"><p className="text-xs text-mute font-semibold mb-1">{s.label}</p><p className="text-lg font-black text-ink">{s.value}</p></div>
        ))}
      </div>

      <div className="p-5 bg-surface rounded-2xl border border-ink/5">
        <div className="flex items-start justify-between mb-4">
          <div><h3 className="text-sm font-black text-ink">Export Your Data</h3><p className="text-xs text-mute">Download a copy of all your data. You'll receive an email when it's ready.</p></div>
          <ActionButton icon={Download} variant="outline" onClick={handleExport}>Export Data</ActionButton>
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-soft rounded-xl">
          <div className="flex items-center gap-3"><IconTile icon={FileText} tone="gray" size={16} /><div><p className="text-sm font-semibold text-ink">Complete Data Export</p><p className="text-xs text-mute">Includes transactions, accounts, budgets, and more.</p></div></div>
          <div className="text-right text-xs text-mute"><p>Estimated time</p><p className="font-semibold">Up to 24 hours</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 bg-surface rounded-2xl border border-ink/5">
          <h3 className="text-sm font-black text-ink mb-3">Privacy Controls</h3>
          {[
            { label: 'Data Usage', sub: 'Control how your data is used to improve your experience.' },
            { label: 'Marketing Preferences', sub: 'Manage how we communicate with you.', badge: 'Opted In' },
            { label: 'Third-Party Access', sub: 'Manage connected apps and data sharing permissions.' },
          ].map(p => (
            <div key={p.label} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
              <div><p className="text-sm font-semibold text-ink">{p.label}</p><p className="text-xs text-mute">{p.sub}</p></div>
              <div className="flex items-center gap-2">{p.badge && <Badge tone="green">{p.badge}</Badge>}<ChevronRight size={14} className="text-mute" /></div>
            </div>
          ))}
        </div>

        <div className="p-5 border border-danger/20 rounded-2xl bg-red-50/50">
          <div className="flex items-start gap-3 mb-4"><IconTile icon={Trash2} tone="red" size={16} /><div><h3 className="text-sm font-black text-ink">Delete Your Data</h3><p className="text-xs text-mute">Permanently delete your account and all associated data. This action cannot be undone.</p></div></div>
          <button onClick={handleDelete} className="w-full py-3 rounded-xl border border-danger text-danger text-sm font-semibold hover:bg-red-50 transition-colors">Delete My Account</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// About Tab
// ─────────────────────────────────────────────
function AboutTab({ showToast }) {
  const handleUpdate = () => {
    showToast('Checking for updates...', 'info')
    setTimeout(() => {
      showToast('You are on the latest version (2.1.0)', 'success')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h2 className="text-lg font-black text-ink mb-0.5">About MoneyPulse</h2><p className="text-sm text-mute">Your all-in-one personal finance OS.</p></div>
        <ActionButton icon={RefreshCw} variant="outline" onClick={handleUpdate}>Check for Updates</ActionButton>
      </div>

      <div className="p-5 bg-surface-soft rounded-2xl">
        <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-ink font-black text-lg">M</div><div><div className="flex items-center gap-2"><p className="text-base font-black text-ink">MoneyPulse</p><Badge tone="green">Current Version</Badge></div><p className="text-xs text-mute">Version 2.1.0 • Build 21052024</p></div></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: '🛡️', title: 'Our Mission', body: 'Empower everyone to make smarter financial decisions.' },
          { icon: '🔒', title: 'Your Privacy', body: 'We value your privacy and never sell your personal data.' },
          { icon: '✨', title: 'Smart & Secure', body: 'Advanced security and AI insights to keep your finances on track.' },
          { icon: '❤️', title: 'Made for You', body: 'Designed with simplicity and clarity to make finance effortless.' },
        ].map(p => (<div key={p.title} className="p-4 bg-surface-soft rounded-xl"><span className="text-2xl block mb-2">{p.icon}</span><p className="text-sm font-black text-ink mb-1">{p.title}</p><p className="text-xs text-mute">{p.body}</p></div>))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 bg-surface rounded-2xl border border-ink/5">
          {[
            { label: 'Website', sub: 'Visit our official website.', action: 'moneypulse.app' },
            { label: 'Help Center', sub: 'Browse help articles and guides.', action: 'Go to Help Center' },
            { label: 'Contact Us', sub: 'Get in touch with our support team.', action: 'support@moneypulse.app' },
            { label: 'Terms of Service', sub: 'Read our terms and conditions.', action: 'View Terms' },
            { label: 'Privacy Policy', sub: 'Learn how we protect your data.', action: 'View Privacy Policy' },
          ].map(l => (<div key={l.label} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0"><div><p className="text-sm font-semibold text-ink">{l.label}</p><p className="text-xs text-mute">{l.sub}</p></div><button className="text-xs text-positive font-semibold hover:underline">{l.action}</button></div>))}
        </div>

        <div className="p-5 bg-surface-soft rounded-2xl">
          <h3 className="text-sm font-black text-ink mb-3">What's New</h3>
          {[
            { tag: 'New', title: 'Version 2.1.0', date: 'May 20, 2024', icon: '🎉' },
            { tag: null, title: 'AI Insights Dashboard', date: 'Get smarter insights and personalized recommendations.', icon: '🤖' },
            { tag: null, title: 'Recurring Enhancements', date: 'More control and flexibility for recurring transactions.', icon: '🔄' },
            { tag: null, title: 'Performance Improvements', date: 'Faster, smoother, and more reliable experience.', icon: '⚡' },
          ].map((n, i) => (<div key={i} className="flex items-start gap-3 py-2.5 border-b border-ink/5 last:border-0"><span className="text-base mt-0.5">{n.icon}</span><div><div className="flex items-center gap-2"><p className="text-sm font-semibold text-ink">{n.title}</p>{n.tag && <Badge tone="green">{n.tag}</Badge>}</div><p className="text-xs text-mute">{n.date}</p></div></div>))}
          <button className="mt-2 text-xs font-semibold text-positive hover:underline">View Changelog →</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Navigation Items
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'profile', label: 'Profile', sub: 'Personal information', icon: User },
  { key: 'notif', label: 'Notifications', sub: 'Manage alerts', icon: Bell },
  { key: 'appearance', label: 'Appearance', sub: 'Theme and display', icon: Palette },
  { key: 'security', label: 'Security', sub: 'Password and 2FA', icon: Shield },
  { key: 'accounts', label: 'Accounts', sub: 'Linked accounts', icon: CreditCard },
  { key: 'privacy', label: 'Data & Privacy', sub: 'Export and delete data', icon: Download },
  { key: 'about', label: 'About', sub: 'App information', icon: Info },
]

// ─────────────────────────────────────────────
// Main Settings Page
// ─────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { toast, showToast, hideToast } = useToast()

  // ─── Fungsi untuk Security Check ───
  const handleSecurityCheck = () => {
    showToast('Security check initiated. Reviewing your account security...', 'info')
    setTimeout(() => {
      showToast('Security check completed! Your account is secure.', 'success')
    }, 2000)
  }

  const TAB_CONTENT = {
    profile: <ProfileTab showToast={showToast} />,
    notif: <NotificationsTab showToast={showToast} />,
    appearance: <AppearanceTab showToast={showToast} />,
    security: <SecurityTab showToast={showToast} />,
    accounts: <AccountsTab showToast={showToast} />,
    privacy: <PrivacyTab showToast={showToast} />,
    about: <AboutTab showToast={showToast} />,
  }

  return (
    <>
      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={hideToast} />

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Settings</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-ink leading-none mb-2">Manage your<br />preferences.</h1>
          <p className="text-base text-body">Customize your experience, manage your account, and keep your data secure.</p>
        </div>
        {/* Tombol Security Check dengan fungsi */}
        <ActionButton icon={Shield} onClick={handleSecurityCheck}>
          Security Check
        </ActionButton>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {NAV_ITEMS.map(({ key, label, sub, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full transition-colors shrink-0 ${activeTab === key ? 'bg-primary-pale text-ink' : 'text-body hover:bg-surface-soft hover:text-ink'}`}>
              <Icon size={18} className="shrink-0" />
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{label}</p><p className="text-[11px] text-mute truncate">{sub}</p></div>
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0 bg-surface rounded-2xl p-6">
          {TAB_CONTENT[activeTab]}
        </div>
      </div>
    </>
  )
}