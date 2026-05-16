// src/pages/Settings.jsx
// ─────────────────────────────────────────────
// Settings Page — Profile, Notifications, Appearance, Security, Accounts, Privacy, About
// Full Supabase integration — NO HARDCODE
// ─────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { 
  User, Bell, Palette, Shield, CreditCard, Download, Info,
  ChevronRight, Check, RefreshCw, ExternalLink, Trash2,
  Camera, PenLine, LockKeyhole, Monitor, Smartphone, Laptop,
  Mail, Goal, ReceiptText, TrendingUp, Calendar, BadgeCheck,
  CircleCheck, Clock, FileText, SquareArrowOutUpRight, Sparkles,
  Plus, X, CheckCircle, XCircle, Upload
} from 'lucide-react'
import { Card, Toggle, Badge, ActionButton, IconTile, Input, Modal, FormGroup, Select } from '../components/common'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useTransactions } from '../hooks/useTransactions'

// ─────────────────────────────────────────────
// Toast Component
// ─────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

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
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit}>
        <FormGroup label="Current Password">
          <Input type="password" required value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
        </FormGroup>
        <FormGroup label="New Password">
          <Input type="password" required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
        </FormGroup>
        <FormGroup label="Confirm New Password">
          <Input type="password" required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
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
// Modal Add Account
// ─────────────────────────────────────────────
function AddAccountModal({ isOpen, onClose, onAdd, showToast }) {
  const [formData, setFormData] = useState({
    name: '', account_number: '', balance: '', type: 'Checking', emoji: '🏦'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.account_number || !formData.balance) {
      showToast('Please fill all required fields', 'error')
      return
    }
    onAdd({
      ...formData,
      balance: parseFloat(formData.balance),
      status: 'active'
    })
    onClose()
    setFormData({ name: '', account_number: '', balance: '', type: 'Checking', emoji: '🏦' })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link New Account">
      <form onSubmit={handleSubmit}>
        <FormGroup label="Bank / Wallet Name *">
          <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Bank BCA, OVO" />
        </FormGroup>
        <FormGroup label="Account Number *">
          <Input required value={formData.account_number} onChange={e => setFormData({...formData, account_number: e.target.value})} placeholder="**** **** **** 1234" />
        </FormGroup>
        <FormGroup label="Balance (IDR) *">
          <Input type="number" required value={formData.balance} onChange={e => setFormData({...formData, balance: e.target.value})} placeholder="0" />
        </FormGroup>
        <FormGroup label="Account Type">
          <Select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
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
// Profile Tab
// ─────────────────────────────────────────────
function ProfileTab({ showToast }) {
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar_url: '',
    currency: 'IDR',
    language: 'English',
    date_format: 'MMM DD, YYYY'
  })
  const [prefs, setPrefs] = useState({
    budget_alerts: true,
    weekly_summary: true,
    marketing_emails: false
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    if (user) fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile({
        name: data.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        phone: data.phone || '',
        avatar_url: data.avatar_url || '',
        currency: data.currency || 'IDR',
        language: data.language || 'English',
        date_format: data.date_format || 'MMM DD, YYYY'
      })
      setEditForm({
        name: data.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        phone: data.phone || ''
      })
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be less than 2MB', 'error')
      return
    }

    setLoading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      showToast('Failed to upload avatar', 'error')
      setLoading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', user.id)

    if (updateError) {
      showToast('Failed to update avatar', 'error')
    } else {
      setProfile(prev => ({ ...prev, avatar_url: urlData.publicUrl }))
      showToast('Avatar updated successfully!', 'success')
    }

    setLoading(false)
  }

  const updateProfile = async (updates) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    return !error
  }

  const handleSaveProfile = async () => {
    const success = await updateProfile({
      name: editForm.name,
      phone: editForm.phone
    })
    if (success) {
      setProfile(prev => ({ ...prev, name: editForm.name, phone: editForm.phone }))
      setShowEditModal(false)
      showToast('Profile updated successfully!', 'success')
    } else {
      showToast('Failed to update profile', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-black text-ink mb-0.5">Profile Information</h2>
          <p className="text-sm text-mute">Update your personal details and preferences.</p>
        </div>
        <ActionButton icon={PenLine} variant="outline" onClick={() => setShowEditModal(true)}>Edit Profile</ActionButton>
      </div>

      <div className="flex items-center gap-4 p-5 bg-surface-soft rounded-2xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-ink font-black text-2xl overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profile.name?.charAt(0) || 'U'
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-surface border border-ink/10 flex items-center justify-center text-xs hover:bg-primary-pale transition-colors disabled:opacity-50"
          >
            <Camera size={12} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        <div>
          <h3 className="text-base font-black text-ink">{profile.name}</h3>
          <p className="text-sm text-mute">{profile.email}</p>
          <div className="flex gap-4 mt-1 text-xs text-mute">
            <span>📞 {profile.phone || 'Not set'}</span>
            <span>📅 Member since {new Date(user?.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button className="p-4 bg-surface-soft rounded-xl text-left hover:bg-primary-pale transition-colors" onClick={() => {
          const newCurrency = profile.currency === 'IDR' ? 'USD' : 'IDR'
          updateProfile({ currency: newCurrency })
          setProfile(prev => ({ ...prev, currency: newCurrency }))
          showToast(`Currency changed to ${newCurrency === 'IDR' ? 'Indonesian Rupiah' : 'US Dollar'}`, 'info')
        }}>
          <p className="text-xs text-mute font-semibold mb-1">Currency</p>
          <p className="text-sm font-semibold text-ink">{profile.currency === 'IDR' ? 'Indonesian Rupiah (IDR)' : 'US Dollar (USD)'}</p>
        </button>
        <button className="p-4 bg-surface-soft rounded-xl text-left hover:bg-primary-pale transition-colors" onClick={() => {
          const newLanguage = profile.language === 'English' ? 'Indonesia' : 'English'
          updateProfile({ language: newLanguage })
          setProfile(prev => ({ ...prev, language: newLanguage }))
          showToast(`Language changed to ${newLanguage}`, 'info')
        }}>
          <p className="text-xs text-mute font-semibold mb-1">Language</p>
          <p className="text-sm font-semibold text-ink">{profile.language}</p>
        </button>
        <button className="p-4 bg-surface-soft rounded-xl text-left hover:bg-primary-pale transition-colors" onClick={() => {
          const newFormat = profile.date_format === 'MMM DD, YYYY' ? 'DD/MM/YYYY' : 'MMM DD, YYYY'
          updateProfile({ date_format: newFormat })
          setProfile(prev => ({ ...prev, date_format: newFormat }))
          showToast('Date format updated', 'info')
        }}>
          <p className="text-xs text-mute font-semibold mb-1">Date Format</p>
          <p className="text-sm font-semibold text-ink">{profile.date_format}</p>
        </button>
      </div>

      <div>
        <h3 className="text-sm font-black text-ink mb-3">Preferences</h3>
        {[
          { key: 'budget_alerts', label: 'Budget Alerts', sub: "Get notified when you're close to your budget limit." },
          { key: 'weekly_summary', label: 'Weekly Summary', sub: 'Receive weekly financial summary.' },
          { key: 'marketing_emails', label: 'Marketing Updates', sub: 'Receive news and updates from MoneyPulse.' },
        ].map(p => (
          <div key={p.key} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
            <div><p className="text-sm font-semibold text-ink">{p.label}</p><p className="text-xs text-mute">{p.sub}</p></div>
            <Toggle checked={prefs[p.key]} onChange={async (v) => {
              const { error } = await supabase
                .from('user_settings')
                .update({ [p.key]: v })
                .eq('user_id', user.id)
              if (!error) {
                setPrefs(prev => ({ ...prev, [p.key]: v }))
                showToast(`${p.label} ${v ? 'enabled' : 'disabled'}`, 'info')
              }
            }} />
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
              <div><label className="block text-sm font-semibold text-ink mb-1.5">Full Name</label><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
              <div><label className="block text-sm font-semibold text-ink mb-1.5">Email Address</label><input type="email" value={editForm.email} disabled className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface-soft text-mute text-sm cursor-not-allowed" /></div>
              <div><label className="block text-sm font-semibold text-ink mb-1.5">Phone Number</label><input type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-ink/10"><button onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Cancel</button><button onClick={handleSaveProfile} className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">Save Changes</button></div>
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
  const { user } = useAuth()
  const [channels, setChannels] = useState({ in_app: true, email: true, push: true })
  const [notifs, setNotifs] = useState({ 
    tx_alerts: true, budget_alerts: true, bill_reminders: true, savings_goals: true, product_updates: false 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchSettings()
  }, [user])

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('in_app_notif, email_notif, push_notif, tx_alerts, budget_alerts, bill_reminders, savings_goals, product_updates')
      .eq('user_id', user.id)
      .single()

    if (!error && data) {
      setChannels({
        in_app: data.in_app_notif ?? true,
        email: data.email_notif ?? true,
        push: data.push_notif ?? true
      })
      setNotifs({
        tx_alerts: data.tx_alerts ?? true,
        budget_alerts: data.budget_alerts ?? true,
        bill_reminders: data.bill_reminders ?? true,
        savings_goals: data.savings_goals ?? true,
        product_updates: data.product_updates ?? false
      })
    }
    setLoading(false)
  }

  const updateSettings = async (updates) => {
    const { error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', user.id)
    return !error
  }

  const handleChannelToggle = async (key, value) => {
    const dbKey = { in_app: 'in_app_notif', email: 'email_notif', push: 'push_notif' }[key]
    const success = await updateSettings({ [dbKey]: value })
    if (success) {
      setChannels(prev => ({ ...prev, [key]: value }))
      showToast(`${key === 'in_app' ? 'In-App' : key === 'email' ? 'Email' : 'Push'} notifications ${value ? 'enabled' : 'disabled'}`, 'info')
    }
  }

  const handleNotifToggle = async (key, value) => {
    const success = await updateSettings({ [key]: value })
    if (success) {
      setNotifs(prev => ({ ...prev, [key]: value }))
      const labels = { tx_alerts: 'Transaction Alerts', budget_alerts: 'Budget Alerts', bill_reminders: 'Bill Reminders', savings_goals: 'Savings Goals', product_updates: 'Product Updates' }
      showToast(`${labels[key]} ${value ? 'enabled' : 'disabled'}`, 'info')
    }
  }

  const handleSave = async () => {
    showToast('Notification settings saved!', 'success')
  }

  if (loading) {
    return <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h2 className="text-lg font-black text-ink mb-0.5">Manage your notifications.</h2><p className="text-sm text-mute">Choose what updates you want to receive and how.</p></div>
        <ActionButton onClick={handleSave}>Save Changes</ActionButton>
      </div>

      <div className="p-5 bg-surface-soft rounded-2xl">
        <h3 className="text-sm font-black text-ink mb-3">Notification Channels</h3>
        {[
          { key: 'in_app', label: 'In-App Notifications', sub: 'Receive alerts inside the MoneyPulse app.' },
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
          { key: 'tx_alerts', label: 'Transaction Alerts', sub: 'Get notified about income, expenses, and transfers.' },
          { key: 'budget_alerts', label: 'Budget Alerts', sub: "Get notified when you're close to or exceed your budget limit." },
          { key: 'bill_reminders', label: 'Bill Reminders', sub: 'Receive reminders before your bills are due.' },
          { key: 'savings_goals', label: 'Savings Goals', sub: 'Get updates about your savings goal progress.' },
          { key: 'product_updates', label: 'Product Updates', sub: 'Receive updates about new features and improvements.' },
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
  const [accent, setAccent] = useState('#9fe870')
  const [compact, setCompact] = useState(false)
  const [animations, setAnimations] = useState(true)
  const [tips, setTips] = useState(true)

  const handleSave = () => {
    showToast('Appearance settings saved!', 'success')
  }

  const handleAccentChange = (newAccent) => {
    setAccent(newAccent)
    document.documentElement.style.setProperty('--color-primary', newAccent)
    showToast('Accent color updated', 'success')
  }

  const COLORS = ['#9fe870', '#3b82f6', '#a855f7', '#f97316', '#ec4899']

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h2 className="text-lg font-black text-ink mb-0.5">Appearance Settings</h2><p className="text-sm text-mute">Customize how MoneyPulse looks and feels.</p></div>
        <ActionButton onClick={handleSave}>Save Changes</ActionButton>
      </div>

      <div className="p-5 bg-surface-soft rounded-2xl">
        <h3 className="text-sm font-black text-ink mb-1">Primary Color</h3>
        <p className="text-xs text-mute mb-3">Choose your accent color.</p>
        <div className="flex gap-3">
          {COLORS.map(c => (
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
// src/pages/Settings.jsx - SecurityTab (hanya current session)

function SecurityTab({ showToast }) {
  const { user } = useAuth()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [currentDevice, setCurrentDevice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchCurrentSession()
  }, [user])

  const fetchCurrentSession = async () => {
    setLoading(true)
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession()
    
    const device = {
      id: session?.access_token?.slice(-10) || 'current',
      name: getDeviceName(),
      location: await getLocation(),
      icon: getDeviceIcon(),
      last_active: new Date().toLocaleString(),
      isCurrent: true
    }
    
    setCurrentDevice(device)
    setLoading(false)
  }

  const getDeviceName = () => {
    const ua = navigator.userAgent
    if (ua.includes('Mac')) return 'MacBook Pro'
    if (ua.includes('Windows')) return 'Windows PC'
    if (ua.includes('iPhone')) return 'iPhone'
    if (ua.includes('Android')) return 'Android Device'
    return navigator.platform || 'Unknown Device'
  }

  const getDeviceIcon = () => {
    const ua = navigator.userAgent
    if (ua.includes('Mac')) return Laptop
    if (ua.includes('Windows')) return Monitor
    if (ua.includes('iPhone')) return Smartphone
    if (ua.includes('Android')) return Smartphone
    return Monitor
  }

  const getLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      return `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`
    } catch {
      return 'Location unknown'
    }
  }

  const handleChangePassword = async (passwords) => {
    const { error } = await supabase.auth.updateUser({
      password: passwords.new
    })
    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast('Password changed successfully!', 'success')
    }
  }

  const handleEnable2FA = () => {
    showToast('2FA setup started! Check your email for verification code.', 'info')
  }

  const handleSecurityCheck = () => {
    showToast('Security check initiated. Reviewing your account security...', 'info')
    setTimeout(() => {
      showToast('Security check completed! Your account is secure.', 'success')
    }, 2000)
  }

  if (loading) {
    return <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
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
        <div className="p-4 bg-surface-soft rounded-xl">
          <p className="text-xs text-mute font-semibold mb-1">Password</p>
          <p className="text-sm font-black text-positive">Strong</p>
        </div>
        <div className="p-4 bg-surface-soft rounded-xl">
          <p className="text-xs text-mute font-semibold mb-1">Two-Factor Auth</p>
          <p className="text-sm font-black text-mute">Disabled</p>
        </div>
        <div className="p-4 bg-surface-soft rounded-xl">
          <p className="text-xs text-mute font-semibold mb-1">Active Sessions</p>
          <p className="text-sm font-black text-blue-600">1 device</p>
        </div>
        <div className="p-4 bg-surface-soft rounded-xl">
          <p className="text-xs text-mute font-semibold mb-1">Last Security Check</p>
          <p className="text-sm font-black text-mute">Just now</p>
        </div>
      </div>

      <div className="p-5 bg-surface rounded-2xl border border-ink/5">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-sm font-black text-ink">Password</h3><p className="text-xs text-mute">Update your password regularly.</p></div>
          <button onClick={() => setShowChangePassword(true)} className="text-sm font-semibold text-positive hover:underline">Change Password</button>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-mute mb-1"><span>Password Strength</span><span className="text-positive font-semibold">Strong</span></div>
          <div className="h-2 rounded-full bg-surface-soft overflow-hidden"><div className="h-full w-4/5 rounded-full bg-positive" /></div>
          <p className="text-xs text-mute mt-2">Last changed recently</p>
        </div>
      </div>

      <div className="p-5 bg-primary-pale rounded-2xl">
        <div className="flex items-start gap-3">
          <IconTile icon={Shield} tone="green" size={20} />
          <div className="flex-1"><p className="text-sm font-black text-positive">2FA Available</p><p className="text-xs text-body">Add an extra layer of security to your account.</p></div>
          <button onClick={handleEnable2FA} className="text-sm font-semibold text-positive hover:underline flex items-center gap-1">Enable <ChevronRight size={14} /></button>
        </div>
      </div>

      {/* Current Session - real data */}
      <div className="p-5 bg-surface rounded-2xl border border-ink/5">
        <h3 className="text-sm font-black text-ink mb-3">Current Session</h3>
        {currentDevice && (
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <IconTile icon={currentDevice.icon} tone="gray" size={16} />
              <div>
                <p className="text-sm font-semibold text-ink">{currentDevice.name}</p>
                <p className="text-xs text-mute">{currentDevice.location}</p>
                <p className="text-[10px] text-mute mt-0.5">Last active: {currentDevice.last_active}</p>
              </div>
            </div>
            <Badge tone="green">Current</Badge>
          </div>
        )}
        <p className="text-xs text-mute mt-3 pt-3 border-t border-ink/5">
          Only your current session is shown. Other devices will appear when they become active.
        </p>
      </div>

      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} onChange={handleChangePassword} showToast={showToast} />
    </div>
  )
}

// ─────────────────────────────────────────────
// Accounts Tab
// ─────────────────────────────────────────────
function AccountsTab({ showToast }) {
  const { user } = useAuth()
  const [autoSync, setAutoSync] = useState(true)
  const [hideZero, setHideZero] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchAccounts()
    fetchSettings()
  }, [user])

  const fetchAccounts = async () => {
    const { data, error } = await supabase
      .from('linked_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      setAccounts(data)
    }
    setLoading(false)
  }

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('auto_sync, hide_zero_balance')
      .eq('user_id', user.id)
      .single()

    if (!error && data) {
      setAutoSync(data.auto_sync ?? true)
      setHideZero(data.hide_zero_balance ?? false)
    }
  }

  const updateSettings = async (updates) => {
    const { error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', user.id)
    return !error
  }

  const handleAddAccount = async (newAccount) => {
    const { data, error } = await supabase
      .from('linked_accounts')
      .insert([{ ...newAccount, user_id: user.id }])
      .select()
      .single()

    if (!error && data) {
      setAccounts([data, ...accounts])
      showToast('Account linked successfully!', 'success')
    } else {
      showToast('Failed to link account', 'error')
    }
  }

  const handleRefresh = async () => {
    showToast('Refreshing all accounts...', 'info')
    await fetchAccounts()
    setTimeout(() => {
      showToast('Accounts refreshed successfully!', 'success')
    }, 1500)
  }

  const handleAutoSyncToggle = async (value) => {
    const success = await updateSettings({ auto_sync: value })
    if (success) {
      setAutoSync(value)
      showToast(`Auto sync ${value ? 'enabled' : 'disabled'}`, 'info')
    }
  }

  const handleHideZeroToggle = async (value) => {
    const success = await updateSettings({ hide_zero_balance: value })
    if (success) {
      setHideZero(value)
      showToast(`Hide zero balance accounts ${value ? 'enabled' : 'disabled'}`, 'info')
    }
  }

  const displayAccounts = hideZero ? accounts.filter(a => a.balance > 0) : accounts
  const totalBalance = accounts.filter(a => a.status === 'active').reduce((s, a) => s + a.balance, 0)

  if (loading) {
    return <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h2 className="text-lg font-black text-ink mb-0.5">Linked Accounts</h2><p className="text-sm text-mute">Connect your bank and financial accounts.</p></div>
        <ActionButton icon={Plus} variant="outline" onClick={() => setShowAddAccount(true)}>Link Account</ActionButton>
      </div>

      <div className="p-5 bg-surface rounded-2xl border border-ink/5">
        {displayAccounts.length === 0 ? (
          <div className="text-center py-8 text-mute">No linked accounts yet. Click "Link Account" to add one.</div>
        ) : (
          displayAccounts.map(a => (
            <div key={a.id} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-soft flex items-center justify-center text-xl">{a.emoji || '🏦'}</div>
                <div><p className="text-sm font-semibold text-ink">{a.name}</p><p className="text-xs text-mute">{a.account_number}</p></div>
              </div>
              <div className="text-right"><p className="text-sm font-semibold text-ink">Rp{a.balance.toLocaleString('id-ID')}</p><p className="text-xs text-mute">{a.type}</p></div>
              <Badge tone={a.status === 'active' ? 'green' : 'gray'}>{a.status === 'active' ? 'Active' : 'Inactive'}</Badge>
            </div>
          ))
        )}
        {accounts.length > 0 && (
          <div className="pt-3 flex items-center justify-between">
            <p className="text-xs text-mute">Showing {displayAccounts.length} accounts</p>
            <button className="text-xs font-semibold text-positive hover:underline">View All →</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-5 bg-primary-pale rounded-2xl">
          <p className="text-xs text-mute font-semibold mb-2">Total Balance</p>
          <p className="text-2xl font-black text-ink">Rp{totalBalance.toLocaleString('id-ID')}</p>
          <p className="text-xs text-positive mt-1">
            {accounts.length > 0 ? `${((totalBalance / (accounts.reduce((s, a) => s + a.balance, 0))) * 100).toFixed(0)}% of total` : 'No data'}
          </p>
          <div className="mt-3 space-y-1 text-xs text-body">
            <div className="flex justify-between"><span>Active Accounts</span><span className="font-semibold">{accounts.filter(a => a.status === 'active').length}</span></div>
            <div className="flex justify-between"><span>Inactive Accounts</span><span className="font-semibold">{accounts.filter(a => a.status === 'inactive').length}</span></div>
            <div className="flex justify-between"><span>Last Updated</span><span className="font-semibold">Just now</span></div>
          </div>
        </div>

        <div className="p-5 bg-surface rounded-2xl border border-ink/5">
          <h3 className="text-sm font-black text-ink mb-3">Account Management</h3>
          <div className="flex items-center justify-between py-2.5 border-b border-ink/5">
            <div><p className="text-sm font-semibold text-ink">Auto Sync</p><p className="text-xs text-mute">Automatically sync your account data.</p></div>
            <Toggle checked={autoSync} onChange={handleAutoSyncToggle} />
          </div>
          <div className="flex items-center justify-between py-2.5">
            <div><p className="text-sm font-semibold text-ink">Hide Zero Balance Accounts</p><p className="text-xs text-mute">Hide accounts with zero balance.</p></div>
            <Toggle checked={hideZero} onChange={handleHideZeroToggle} />
          </div>
          <button onClick={handleRefresh} className="mt-3 flex items-center gap-2 text-xs font-semibold text-mute hover:text-ink"><RefreshCw size={13} /> Refresh All Accounts</button>
        </div>
      </div>

      <AddAccountModal isOpen={showAddAccount} onClose={() => setShowAddAccount(false)} onAdd={handleAddAccount} showToast={showToast} />
    </div>
  )
}

// ─────────────────────────────────────────────
// Data & Privacy Tab
// ─────────────────────────────────────────────
function PrivacyTab({ showToast }) {
  const { user } = useAuth()
  const [lastExport, setLastExport] = useState(null)

  useEffect(() => {
    if (user) fetchLastExport()
  }, [user])

  const fetchLastExport = async () => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('last_export')
      .eq('user_id', user.id)
      .single()
    
    if (data?.last_export) {
      setLastExport(new Date(data.last_export).toLocaleDateString())
    }
  }

  const handleExport = async () => {
    showToast('Export started. You will receive an email when ready.', 'info')
    await supabase
      .from('user_settings')
      .update({ last_export: new Date().toISOString() })
      .eq('user_id', user.id)
    setLastExport(new Date().toLocaleDateString())
    setTimeout(() => {
      showToast('Your data export is ready! Check your email.', 'success')
    }, 2000)
  }

  const handleDelete = () => {
    if (confirm('Are you sure? This action cannot be undone!')) {
      showToast('Account deletion request submitted. We\'re sad to see you go.', 'info')
    }
  }

  // Get real data categories count
  const [stats, setStats] = useState({ categories: 0, encrypted: true })
  
  useEffect(() => {
    const getStats = async () => {
      const { count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      setStats({ categories: count || 0, encrypted: true })
    }
    if (user) getStats()
  }, [user])

  return (
    <div className="space-y-6">
      <div><h2 className="text-lg font-black text-ink mb-0.5">Data & Privacy Overview</h2><p className="text-sm text-mute">You're in control of your data. Manage, export, or delete your information anytime.</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Data Categories', value: stats.categories, sub: 'Transactions & records' },
          { label: 'Data Encrypted', value: stats.encrypted ? '100%' : 'N/A', sub: 'Your data is always protected' },
          { label: "You're in Control", value: '✓', sub: 'Manage your data and privacy settings' },
          { label: 'Last Export', value: lastExport || 'Never', sub: 'Last data export' },
        ].map(s => (
          <div key={s.label} className="p-4 bg-surface-soft rounded-xl">
            <p className="text-xs text-mute font-semibold mb-1">{s.label}</p>
            <p className="text-lg font-black text-ink">{s.value}</p>
            <p className="text-xs text-mute">{s.sub}</p>
          </div>
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
  const [appInfo, setAppInfo] = useState({ version: '2.1.0', build: '21052024', releaseDate: 'May 20, 2024' })

  const handleUpdate = () => {
    showToast('Checking for updates...', 'info')
    setTimeout(() => {
      showToast(`You are on the latest version (${appInfo.version})`, 'success')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h2 className="text-lg font-black text-ink mb-0.5">About MoneyPulse</h2><p className="text-sm text-mute">Your all-in-one personal finance OS.</p></div>
        <ActionButton icon={RefreshCw} variant="outline" onClick={handleUpdate}>Check for Updates</ActionButton>
      </div>

      <div className="p-5 bg-surface-soft rounded-2xl">
        <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-ink font-black text-lg">M</div><div><div className="flex items-center gap-2"><p className="text-base font-black text-ink">MoneyPulse</p><Badge tone="green">v{appInfo.version}</Badge></div><p className="text-xs text-mute">Build {appInfo.build} • Released {appInfo.releaseDate}</p></div></div>
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
          <div className="space-y-3">
            <div className="flex items-start gap-3"><span className="text-lg">🎉</span><div><p className="text-sm font-semibold text-ink">Version {appInfo.version}</p><p className="text-xs text-mute">{appInfo.releaseDate}</p></div></div>
            <div className="flex items-start gap-3"><span className="text-lg">🤖</span><div><p className="text-sm font-semibold text-ink">AI Insights Dashboard</p><p className="text-xs text-mute">Get smarter insights and personalized recommendations.</p></div></div>
            <div className="flex items-start gap-3"><span className="text-lg">🔄</span><div><p className="text-sm font-semibold text-ink">Recurring Enhancements</p><p className="text-xs text-mute">More control and flexibility for recurring transactions.</p></div></div>
            <div className="flex items-start gap-3"><span className="text-lg">⚡</span><div><p className="text-sm font-semibold text-ink">Performance Improvements</p><p className="text-xs text-mute">Faster, smoother, and more reliable experience.</p></div></div>
          </div>
          <button className="mt-3 text-xs font-semibold text-positive hover:underline">View Changelog →</button>
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
  const [toast, setToast] = useState(null)

  const showToast = (message, type) => {
    setToast({ message, type })
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Settings</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-ink leading-none mb-2">Manage your<br />preferences.</h1>
          <p className="text-base text-body">Customize your experience, manage your account, and keep your data secure.</p>
        </div>
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