// src/pages/Recurring.jsx
// ─────────────────────────────────────────────
// Recurring payments — full fungsi (add, edit, delete, toggle, filter, search, filter modal, review modal)
// Siap konek ke Supabase nanti
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { 
  Plus, Filter, Search, MoreHorizontal, RefreshCw, Clock, 
  TrendingDown, TrendingUp, Edit2, Trash2, Check, X,
  ChevronRight, AlertCircle, Eye
} from 'lucide-react'
import { ActionButton, Badge, Card, IconTile, Modal, FormGroup, Input, Select } from '../components/common'

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const CATEGORY_FILTERS = ['All', 'Subscriptions', 'Bills', 'Loans', 'Insurance']
const FREQUENCY_OPTIONS = ['Monthly', 'Weekly', 'Yearly', 'One-time']
const CATEGORY_OPTIONS = ['Subscription', 'Bill', 'Loan', 'Insurance']

// ─────────────────────────────────────────────
// Initial data (nanti diganti dengan fetch dari Supabase)
// ─────────────────────────────────────────────
const INITIAL_RECURRING = [
  { id: '1', name: 'Spotify Premium', description: 'Music streaming', category: 'Subscription', amount: 59000, frequency: 'Monthly', nextPayment: '2024-06-02', status: 'active', icon: '🎵', userId: 'user_1' },
  { id: '2', name: 'Netflix', description: 'Video streaming', category: 'Subscription', amount: 149000, frequency: 'Monthly', nextPayment: '2024-06-05', status: 'active', icon: '🎬', userId: 'user_1' },
  { id: '3', name: 'PLN Electricity', description: 'Utilities', category: 'Bill', amount: 450000, frequency: 'Monthly', nextPayment: '2024-06-10', status: 'active', icon: '⚡', userId: 'user_1' },
  { id: '4', name: 'Internet (Indihome)', description: 'Internet service', category: 'Bill', amount: 280000, frequency: 'Monthly', nextPayment: '2024-06-12', status: 'active', icon: '🌐', userId: 'user_1' },
  { id: '5', name: 'Adobe Creative Cloud', description: 'Design tools', category: 'Subscription', amount: 239000, frequency: 'Monthly', nextPayment: '2024-06-15', status: 'active', icon: '🎨', userId: 'user_1' },
  { id: '6', name: 'Tokopedia Premium', description: 'E-commerce', category: 'Subscription', amount: 68000, frequency: 'Monthly', nextPayment: '2024-06-20', status: 'inactive', icon: '🛒', userId: 'user_1' },
]

// ─────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────
const formatCurrency = (amount) => `Rp${amount.toLocaleString('id-ID')}`

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getCategoryTone = (category) => {
  const map = { 'Subscription': 'green', 'Bill': 'blue', 'Loan': 'orange', 'Insurance': 'yellow' }
  return map[category] || 'gray'
}

// ─────────────────────────────────────────────
// Modal: Add / Edit Recurring
// ─────────────────────────────────────────────
function RecurringFormModal({ isOpen, onClose, onSave, editingItem }) {
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'Subscription', amount: '',
    frequency: 'Monthly', nextPayment: new Date().toISOString().split('T')[0],
    status: 'active', icon: '📋'
  })

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name, description: editingItem.description,
        category: editingItem.category, amount: editingItem.amount.toString(),
        frequency: editingItem.frequency, nextPayment: editingItem.nextPayment,
        status: editingItem.status, icon: editingItem.icon
      })
    } else {
      setFormData({
        name: '', description: '', category: 'Subscription', amount: '',
        frequency: 'Monthly', nextPayment: new Date().toISOString().split('T')[0],
        status: 'active', icon: '📋'
      })
    }
  }, [editingItem, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.amount) return alert('Please fill in name and amount')
    const newItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name, description: formData.description, category: formData.category,
      amount: parseFloat(formData.amount), frequency: formData.frequency,
      nextPayment: formData.nextPayment, status: formData.status, icon: formData.icon || '📋',
      userId: 'user_1'
    }
    onSave(newItem)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Edit Recurring' : 'Add Recurring'}>
      <form onSubmit={handleSubmit}>
        <FormGroup label="Name *"><Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Netflix, Spotify" /></FormGroup>
        <FormGroup label="Description"><Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Additional details" /></FormGroup>
        <FormGroup label="Category">
          <Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormGroup>
        <FormGroup label="Amount (IDR) *"><Input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0" /></FormGroup>
        <FormGroup label="Frequency">
          <Select value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
            {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </Select>
        </FormGroup>
        <FormGroup label="Next Payment Date"><Input type="date" value={formData.nextPayment} onChange={e => setFormData({...formData, nextPayment: e.target.value})} /></FormGroup>
        <FormGroup label="Status">
          <div className="flex gap-3">
            <button type="button" onClick={() => setFormData({...formData, status: 'active'})}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${formData.status === 'active' ? 'bg-positive text-white' : 'bg-surface-soft text-mute'}`}>Active</button>
            <button type="button" onClick={() => setFormData({...formData, status: 'inactive'})}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${formData.status === 'inactive' ? 'bg-danger text-white' : 'bg-surface-soft text-mute'}`}>Inactive</button>
          </div>
        </FormGroup>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-colors">{editingItem ? 'Save Changes' : 'Add Recurring'}</button>
        </div>
      </form>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Modal: Delete confirmation
// ─────────────────────────────────────────────
function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Recurring">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 size={28} className="text-danger" /></div>
        <p className="text-ink font-semibold mb-2">Delete "{itemName}"?</p>
        <p className="text-mute text-sm mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-colors">Delete</button>
        </div>
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Modal: Filter (yang di samping search bar)
// ─────────────────────────────────────────────
function FilterModal({ isOpen, onClose, filterCategory, setFilterCategory, filterStatus, setFilterStatus, onReset }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Recurring">
      <FormGroup label="Category">
        <Select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </FormGroup>
      <FormGroup label="Status">
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </FormGroup>
      <div className="flex gap-3 mt-6">
        <button onClick={onReset} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft transition-colors">Reset</button>
        <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-colors">Apply</button>
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Modal: Review Subscriptions
// ─────────────────────────────────────────────
function ReviewModal({ isOpen, onClose, items, onUnsubscribe }) {
  const totalPotential = items.reduce((sum, item) => sum + item.amount, 0)
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Subscriptions">
      <div className="space-y-4">
        {/* Summary */}
        <div className="bg-primary-pale rounded-xl p-4 text-center">
          <p className="text-sm text-mute mb-1">Potential monthly savings</p>
          <p className="text-2xl font-black text-positive">{formatCurrency(totalPotential)}</p>
          <p className="text-xs text-mute mt-1">from {items.length} subscription(s)</p>
        </div>
        
        {/* List of subscriptions to review */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center text-mute py-8">No subscriptions to review</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-surface-soft rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-mute">{item.category} • {item.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-danger">{formatCurrency(item.amount)}</p>
                    <Badge tone={item.status === 'active' ? 'green' : 'gray'}>{item.status}</Badge>
                  </div>
                  <button 
                    onClick={() => onUnsubscribe(item.id, item.name)}
                    className="px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-xs font-semibold hover:bg-danger/20 transition-colors"
                  >
                    Unsubscribe
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-ink/10">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-colors">
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Main Recurring Page
// ─────────────────────────────────────────────
export default function RecurringPage() {
  // ─── State ─────────────────────────────────
  const [items, setItems] = useState(INITIAL_RECURRING)
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [actionMenuOpen, setActionMenuOpen] = useState(null)
  const [reviewItems, setReviewItems] = useState([])

  // ─── Statistics from real data ─────────────
  const activeItems = items.filter(i => i.status === 'active')
  const totalMonthly = activeItems.reduce((s, i) => s + i.amount, 0)
  const activeCount = activeItems.length
  const dueCount = activeItems.filter(i => {
    const nextDate = new Date(i.nextPayment)
    const today = new Date()
    const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }).length
  const annualAmount = totalMonthly * 12

  // ─── Filter logic (semua filter berfungsi) ─
  const filteredItems = items.filter(item => {
    // 1. Filter by tab (All, Subscriptions, Bills, Loans, Insurance)
    if (activeFilter !== 'All') {
      if (activeFilter === 'Subscriptions' && item.category !== 'Subscription') return false
      if (activeFilter === 'Bills' && item.category !== 'Bill') return false
      if (activeFilter === 'Loans' && item.category !== 'Loan') return false
      if (activeFilter === 'Insurance' && item.category !== 'Insurance') return false
    }
    
    // 2. Filter by search (name or description)
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase()
      const matchName = item.name.toLowerCase().includes(searchLower)
      const matchDesc = item.description.toLowerCase().includes(searchLower)
      if (!matchName && !matchDesc) return false
    }
    
    // 3. Filter by category (dari modal filter)
    if (filterCategory !== 'all' && item.category !== filterCategory) return false
    
    // 4. Filter by status (dari modal filter)
    if (filterStatus !== 'all' && item.status !== filterStatus) return false
    
    return true
  })

  // ─── Reset semua filter ────────────────────
  const resetAllFilters = () => {
    setActiveFilter('All')
    setSearch('')
    setFilterCategory('all')
    setFilterStatus('all')
  }

  // ─── Review Subscriptions ──────────────────
  const handleReviewSubscriptions = () => {
    // Filter items yang inactive atau biaya > 100rb
    const itemsToReview = items.filter(item => 
      item.status === 'inactive' || item.amount > 100000
    )
    setReviewItems(itemsToReview)
    setIsReviewModalOpen(true)
  }

  const handleUnsubscribe = (id, name) => {
    if (confirm(`Unsubscribe from "${name}"? This will mark it as inactive.`)) {
      setItems(items.map(item => 
        item.id === id ? { ...item, status: 'inactive' } : item
      ))
      // Update review list
      setReviewItems(reviewItems.filter(item => item.id !== id))
    }
  }

  // ─── CRUD Operations ────────────────────────
  const handleAdd = (newItem) => setItems([newItem, ...items])
  const handleEdit = (item) => { setEditingItem(item); setIsAddModalOpen(true) }
  const handleSave = (savedItem) => {
    if (editingItem) {
      setItems(items.map(i => i.id === savedItem.id ? savedItem : i))
      setEditingItem(null)
    } else {
      setItems([savedItem, ...items])
    }
  }
  const handleDelete = () => {
    if (deletingItem) {
      setItems(items.filter(i => i.id !== deletingItem.id))
      setIsDeleteModalOpen(false)
      setDeletingItem(null)
    }
  }
  const handleToggleStatus = (item) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active'
    setItems(items.map(i => i.id === item.id ? { ...i, status: newStatus } : i))
  }

  // ─── Render ─────────────────────────────────
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Recurring Payments</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-ink leading-none mb-2">Manage your<br />recurring payments.</h1>
          <p className="text-base text-body">Track and manage all your subscriptions and recurring bills in one place.</p>
        </div>
        <ActionButton icon={Plus} onClick={() => { setEditingItem(null); setIsAddModalOpen(true) }}>Add Recurring</ActionButton>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><div className="flex items-start justify-between mb-2"><p className="text-xs text-mute font-semibold">Total Monthly Commitment</p><IconTile icon={RefreshCw} tone="green" size={16} /></div><p className="text-xl font-black tracking-tight text-ink mb-1">{formatCurrency(totalMonthly)}</p><Badge tone="green">-4.2% vs last month</Badge></Card>
        <Card><div className="flex items-start justify-between mb-2"><p className="text-xs text-mute font-semibold">Active Subscriptions</p><IconTile icon={TrendingUp} tone="green" size={16} /></div><p className="text-xl font-black tracking-tight text-ink mb-1">{activeCount}</p><Badge tone="green">No change</Badge></Card>
        <Card><div className="flex items-start justify-between mb-2"><p className="text-xs text-mute font-semibold">Due This Month</p><IconTile icon={Clock} tone="orange" size={16} /></div><p className="text-xl font-black tracking-tight text-ink mb-1">{formatCurrency(totalMonthly)}</p><Badge tone="orange">{dueCount} payments due soon</Badge></Card>
        <Card><div className="flex items-start justify-between mb-2"><p className="text-xs text-mute font-semibold">Annual Amount</p><IconTile icon={TrendingDown} tone="red" size={16} /></div><p className="text-xl font-black tracking-tight text-ink mb-1">{formatCurrency(annualAmount)}</p><Badge tone="red">-6.8% vs last year</Badge></Card>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 flex-wrap items-center">
        {/* Category filter tabs */}
        <div className="flex gap-1 bg-surface rounded-xl p-1 border border-ink/5">
          {CATEGORY_FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === f ? 'bg-primary text-ink' : 'text-body hover:text-ink'}`}>
              {f}
            </button>
          ))}
        </div>
        
        {/* Search bar */}
        <div className="flex items-center gap-2 flex-1 min-w-45 bg-surface rounded-xl px-4 py-2.5 border border-ink/10">
          <Search size={16} className="text-mute" />
          <input type="text" placeholder="Search recurring..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-sm text-ink bg-transparent focus:outline-none placeholder:text-mute" />
          {search && <button onClick={() => setSearch('')} className="text-mute hover:text-ink"><X size={14} /></button>}
        </div>
        
        {/* Filter button (modal) */}
        <ActionButton icon={Filter} variant="outline" onClick={() => setIsFilterModalOpen(true)}>Filter</ActionButton>
        
        {/* Reset all filters button */}
        {(activeFilter !== 'All' || search || filterCategory !== 'all' || filterStatus !== 'all') && (
          <button onClick={resetAllFilters} className="text-xs text-mute hover:text-ink underline">Clear all</button>
        )}
      </div>

      {/* Active Filters Indicator */}
      {(activeFilter !== 'All' || search || filterCategory !== 'all' || filterStatus !== 'all') && (
        <div className="flex gap-2 flex-wrap -mt-2">
          {activeFilter !== 'All' && <Badge tone="blue">{activeFilter}</Badge>}
          {search && <Badge tone="gray">Search: {search}</Badge>}
          {filterCategory !== 'all' && <Badge tone="orange">Category: {filterCategory}</Badge>}
          {filterStatus !== 'all' && <Badge tone={filterStatus === 'active' ? 'green' : 'gray'}>Status: {filterStatus}</Badge>}
        </div>
      )}

      {/* Recurring Table */}
      <Card>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-200">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Merchant / Service</th>
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Category</th>
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Amount</th>
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Frequency</th>
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Next Payment</th>
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Status</th>
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-surface-soft/50 transition-colors group">
                  <td className="py-4 pr-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-surface-soft flex items-center justify-center text-lg shrink-0">{item.icon}</div><div><p className="text-sm font-semibold text-ink">{item.name}</p><p className="text-xs text-mute">{item.description}</p></div></div></td>
                  <td className="py-4 pr-4"><Badge tone={getCategoryTone(item.category)}>{item.category}</Badge></td>
                  <td className="py-4 pr-4 text-sm font-semibold text-ink">{formatCurrency(item.amount)}</td>
                  <td className="py-4 pr-4 text-sm text-body">{item.frequency}</td>
                  <td className="py-4 pr-4 text-sm text-body">{formatDate(item.nextPayment)}</td>
                  <td className="py-4 pr-4">
                    <button onClick={() => handleToggleStatus(item)} className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${item.status === 'active' ? 'bg-positive/20 text-positive hover:bg-positive/30' : 'bg-mute/20 text-mute hover:bg-mute/30'}`}>
                      {item.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-4">
                    <div className="relative">
                      <button onClick={() => setActionMenuOpen(actionMenuOpen === item.id ? null : item.id)} className="w-8 h-8 rounded-full hover:bg-surface-soft flex items-center justify-center transition-colors"><MoreHorizontal size={16} className="text-mute" /></button>
                      {actionMenuOpen === item.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-surface rounded-xl shadow-lg border border-ink/5 z-10 overflow-hidden">
                          <button onClick={() => { handleEdit(item); setActionMenuOpen(null) }} className="w-full px-4 py-2 text-left text-sm text-ink hover:bg-surface-soft flex items-center gap-2"><Edit2 size={14} /> Edit</button>
                          <button onClick={() => { setDeletingItem(item); setIsDeleteModalOpen(true); setActionMenuOpen(null) }} className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr><td colSpan={7} className="text-center py-16 text-mute"><AlertCircle size={32} className="mx-auto mb-2 text-mute/50" />No recurring payments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Savings Banner dengan Review Button */}
      {activeItems.length > 0 && (
        <div className="bg-ink rounded-2xl p-5 flex items-center gap-4 flex-wrap">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl shrink-0">🐷</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-semibold">You can save up to <span className="text-primary font-black">{formatCurrency(Math.round(totalMonthly * 0.15))}</span> per month by reviewing unused subscriptions.</p>
            <p className="text-xs text-white/50">Review your subscriptions and cancel what you don't use.</p>
          </div>
          <button 
            onClick={handleReviewSubscriptions}
            className="px-5 py-2.5 bg-primary text-ink text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors shrink-0 flex items-center gap-2"
          >
            <Eye size={16} /> Review Subscriptions →
          </button>
        </div>
      )}

      {/* Modals */}
      <RecurringFormModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setEditingItem(null) }} onSave={handleSave} editingItem={editingItem} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setDeletingItem(null) }} onConfirm={handleDelete} itemName={deletingItem?.name} />
      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        filterCategory={filterCategory} 
        setFilterCategory={setFilterCategory} 
        filterStatus={filterStatus} 
        setFilterStatus={setFilterStatus} 
        onReset={() => { setFilterCategory('all'); setFilterStatus('all') }}
      />
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        items={reviewItems}
        onUnsubscribe={handleUnsubscribe}
      />
    </>
  )
}