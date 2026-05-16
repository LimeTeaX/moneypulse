import { useState, useEffect } from 'react'
import { 
  Plus, Filter, Search, MoreHorizontal, RefreshCw, Clock, 
  TrendingDown, TrendingUp, Edit2, Trash2, Check, X,
  ChevronRight, AlertCircle, Eye
} from 'lucide-react'
import { ActionButton, Badge, Card, IconTile, Modal, FormGroup, Input, Select } from '../components/common'
import { Toast, useToast } from '../components/common/Toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const CATEGORY_FILTERS = ['All', 'Subscriptions', 'Bills', 'Loans', 'Insurance']
const FREQUENCY_OPTIONS = ['Monthly', 'Weekly', 'Yearly', 'One-time']
const CATEGORY_OPTIONS = ['Subscription', 'Bill', 'Loan', 'Insurance']

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
    frequency: 'Monthly', next_payment: new Date().toISOString().split('T')[0],
    status: 'active', icon: '📋'
  })

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
        category: editingItem.category || 'Subscription',
        amount: editingItem.amount?.toString() || '',
        frequency: editingItem.frequency || 'Monthly',
        next_payment: editingItem.next_payment || new Date().toISOString().split('T')[0],
        status: editingItem.status || 'active',
        icon: editingItem.icon || '📋'
      })
    } else {
      setFormData({
        name: '', description: '', category: 'Subscription', amount: '',
        frequency: 'Monthly', next_payment: new Date().toISOString().split('T')[0],
        status: 'active', icon: '📋'
      })
    }
  }, [editingItem, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.amount) return
    onSave({
      id: editingItem?.id,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      next_payment: formData.next_payment,
      status: formData.status,
      icon: formData.icon || '📋'
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? 'Edit Recurring' : 'Add Recurring'}>
      <form onSubmit={handleSubmit}>
        <FormGroup label="Name *">
          <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Netflix, Spotify" />
        </FormGroup>
        <FormGroup label="Description">
          <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Additional details" />
        </FormGroup>
        <FormGroup label="Category">
          <Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormGroup>
        <FormGroup label="Amount (IDR) *">
          <Input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0" />
        </FormGroup>
        <FormGroup label="Frequency">
          <Select value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
            {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </Select>
        </FormGroup>
        <FormGroup label="Next Payment Date">
          <Input type="date" value={formData.next_payment} onChange={e => setFormData({...formData, next_payment: e.target.value})} />
        </FormGroup>
        <FormGroup label="Status">
          <div className="flex gap-3">
            <button type="button" onClick={() => setFormData({...formData, status: 'active'})}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${formData.status === 'active' ? 'bg-positive text-white' : 'bg-surface-soft text-mute'}`}>
              Active
            </button>
            <button type="button" onClick={() => setFormData({...formData, status: 'inactive'})}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${formData.status === 'inactive' ? 'bg-danger text-white' : 'bg-surface-soft text-mute'}`}>
              Inactive
            </button>
          </div>
        </FormGroup>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">
            {editingItem ? 'Save Changes' : 'Add Recurring'}
          </button>
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
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={28} className="text-danger" />
        </div>
        <p className="text-ink font-semibold mb-2">Delete "{itemName}"?</p>
        <p className="text-mute text-sm mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger/90">Delete</button>
        </div>
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Modal: Filter
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
        <button onClick={onReset} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Reset</button>
        <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">Apply</button>
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
        <div className="bg-primary-pale rounded-xl p-4 text-center">
          <p className="text-sm text-mute mb-1">Potential monthly savings</p>
          <p className="text-2xl font-black text-positive">{formatCurrency(totalPotential)}</p>
          <p className="text-xs text-mute mt-1">from {items.length} subscription(s)</p>
        </div>
        
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
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">Close</button>
        </div>
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Main Recurring Page
// ─────────────────────────────────────────────
export default function RecurringPage() {
  const { user } = useAuth()
  const { toast, showToast, hideToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
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

  // ─── Fetch recurring from Supabase ───
  const fetchRecurring = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('recurring')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      showToast('Error fetching recurring data', 'error')
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRecurring()
  }, [user])

  // ─── Statistics from real data ───
  const activeItems = items.filter(i => i.status === 'active')
  const totalMonthly = activeItems.reduce((s, i) => s + i.amount, 0)
  const activeCount = activeItems.length
  const dueCount = activeItems.filter(i => {
    const nextDate = new Date(i.next_payment)
    const today = new Date()
    const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }).length
  const annualAmount = totalMonthly * 12

  // ─── Calculate percentage changes ───
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  let currentMonthTotal = 0
  let lastMonthTotal = 0

  activeItems.forEach(item => {
    const paymentDate = new Date(item.next_payment)
    if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
      currentMonthTotal += item.amount
    }
    if (paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastMonthYear) {
      lastMonthTotal += item.amount
    }
  })

  const monthlyChange = calculatePercentageChange(currentMonthTotal, lastMonthTotal)
  
  let lastMonthActiveCount = 0
  activeItems.forEach(item => {
    const createdAt = new Date(item.created_at)
    if (createdAt.getMonth() === lastMonth && createdAt.getFullYear() === lastMonthYear) {
      lastMonthActiveCount++
    }
  })
  const activeCountChange = calculatePercentageChange(activeCount, lastMonthActiveCount)

  let lastMonthDueCount = 0
  activeItems.forEach(item => {
    const nextDate = new Date(item.next_payment)
    if (nextDate.getMonth() === lastMonth && nextDate.getFullYear() === lastMonthYear) {
      const diffDays = Math.ceil((nextDate - new Date()) / (1000 * 60 * 60 * 24))
      if (diffDays <= 7 && diffDays >= 0) {
        lastMonthDueCount++
      }
    }
  })
  const dueCountChange = calculatePercentageChange(dueCount, lastMonthDueCount)

  const monthlyAverage = activeItems.length > 0 ? totalMonthly / activeItems.length : 0
  let lastYearAverage = 0
  let lastYearCount = 0
  activeItems.forEach(item => {
    const createdAt = new Date(item.created_at)
    if (createdAt.getFullYear() === currentYear - 1) {
      lastYearAverage += item.amount
      lastYearCount++
    }
  })
  lastYearAverage = lastYearCount > 0 ? lastYearAverage / lastYearCount : 0
  const annualChange = calculatePercentageChange(monthlyAverage, lastYearAverage)

  // ─── Filter logic ───
  const filteredItems = items.filter(item => {
    if (activeFilter !== 'All') {
      if (activeFilter === 'Subscriptions' && item.category !== 'Subscription') return false
      if (activeFilter === 'Bills' && item.category !== 'Bill') return false
      if (activeFilter === 'Loans' && item.category !== 'Loan') return false
      if (activeFilter === 'Insurance' && item.category !== 'Insurance') return false
    }
    
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase()
      const matchName = item.name.toLowerCase().includes(searchLower)
      const matchDesc = item.description?.toLowerCase().includes(searchLower)
      if (!matchName && !matchDesc) return false
    }
    
    if (filterCategory !== 'all' && item.category !== filterCategory) return false
    if (filterStatus !== 'all' && item.status !== filterStatus) return false
    
    return true
  })

  const resetAllFilters = () => {
    setActiveFilter('All')
    setSearch('')
    setFilterCategory('all')
    setFilterStatus('all')
    showToast('All filters cleared', 'info')
  }

  // ─── CRUD Operations with Toast ───
  const handleAdd = async (newItem) => {
    const { data, error } = await supabase
      .from('recurring')
      .insert([{ ...newItem, user_id: user.id }])
      .select()
      .single()
    
    if (error) {
      showToast('Failed to add recurring: ' + error.message, 'error')
    } else {
      setItems([data, ...items])
      showToast('Recurring added successfully!', 'success')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsAddModalOpen(true)
  }

  const handleSave = async (savedItem) => {
    if (editingItem) {
      const { error } = await supabase
        .from('recurring')
        .update({
          name: savedItem.name,
          description: savedItem.description,
          category: savedItem.category,
          amount: savedItem.amount,
          frequency: savedItem.frequency,
          next_payment: savedItem.next_payment,
          status: savedItem.status,
          icon: savedItem.icon
        })
        .eq('id', editingItem.id)
        .eq('user_id', user.id)
      
      if (error) {
        showToast('Failed to update recurring: ' + error.message, 'error')
      } else {
        setItems(items.map(i => i.id === editingItem.id ? { ...i, ...savedItem } : i))
        setEditingItem(null)
        showToast('Recurring updated successfully!', 'success')
      }
    } else {
      const { data, error } = await supabase
        .from('recurring')
        .insert([{ 
          name: savedItem.name,
          description: savedItem.description,
          category: savedItem.category,
          amount: savedItem.amount,
          frequency: savedItem.frequency,
          next_payment: savedItem.next_payment,
          status: savedItem.status,
          icon: savedItem.icon,
          user_id: user.id
        }])
        .select()
        .single()
      
      if (error) {
        showToast('Failed to add recurring: ' + error.message, 'error')
      } else {
        setItems([data, ...items])
        showToast('Recurring added successfully!', 'success')
      }
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return
    
    const { error } = await supabase
      .from('recurring')
      .delete()
      .eq('id', deletingItem.id)
      .eq('user_id', user.id)
    
    if (error) {
      showToast('Failed to delete recurring: ' + error.message, 'error')
    } else {
      setItems(items.filter(i => i.id !== deletingItem.id))
      setIsDeleteModalOpen(false)
      setDeletingItem(null)
      showToast('Recurring deleted successfully!', 'success')
    }
  }

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active'
    const { error } = await supabase
      .from('recurring')
      .update({ status: newStatus })
      .eq('id', item.id)
      .eq('user_id', user.id)
    
    if (error) {
      showToast('Failed to update status', 'error')
    } else {
      setItems(items.map(i => i.id === item.id ? { ...i, status: newStatus } : i))
      showToast(`Status changed to ${newStatus}`, 'info')
    }
  }

  const handleReviewSubscriptions = () => {
    const itemsToReview = items.filter(item => 
      item.status === 'inactive' || item.amount > 100000
    )
    setReviewItems(itemsToReview)
    setIsReviewModalOpen(true)
    showToast(`${itemsToReview.length} subscriptions ready for review`, 'info')
  }

  const handleUnsubscribe = async (id, name) => {
    if (confirm(`Unsubscribe from "${name}"? This will mark it as inactive.`)) {
      const { error } = await supabase
        .from('recurring')
        .update({ status: 'inactive' })
        .eq('id', id)
        .eq('user_id', user.id)
      
      if (error) {
        showToast('Failed to unsubscribe', 'error')
      } else {
        setItems(items.map(item => 
          item.id === id ? { ...item, status: 'inactive' } : item
        ))
        setReviewItems(reviewItems.filter(item => item.id !== id))
        showToast(`Unsubscribed from ${name}`, 'success')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {/* Toast Notification */}
      <Toast isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={hideToast} />

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
        <Card>
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-mute font-semibold">Total Monthly Commitment</p>
            <IconTile icon={RefreshCw} tone="green" size={16} />
          </div>
          <p className="text-xl font-black tracking-tight text-ink mb-1">{formatCurrency(totalMonthly)}</p>
          <Badge tone={monthlyChange >= 0 ? 'green' : 'red'}>
            {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}% vs last month
          </Badge>
        </Card>
        
        <Card>
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-mute font-semibold">Active Subscriptions</p>
            <IconTile icon={TrendingUp} tone="green" size={16} />
          </div>
          <p className="text-xl font-black tracking-tight text-ink mb-1">{activeCount}</p>
          <Badge tone={activeCountChange >= 0 ? 'green' : 'red'}>
            {activeCountChange >= 0 ? '+' : ''}{activeCountChange.toFixed(1)}% vs last month
          </Badge>
        </Card>
        
        <Card>
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-mute font-semibold">Due This Month</p>
            <IconTile icon={Clock} tone="orange" size={16} />
          </div>
          <p className="text-xl font-black tracking-tight text-ink mb-1">{formatCurrency(currentMonthTotal)}</p>
          <Badge tone={dueCountChange >= 0 ? 'orange' : 'green'}>
            {dueCountChange >= 0 ? '+' : ''}{dueCountChange.toFixed(1)}% vs last month
          </Badge>
        </Card>
        
        <Card>
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-mute font-semibold">Annual Amount</p>
            <IconTile icon={TrendingDown} tone="red" size={16} />
          </div>
          <p className="text-xl font-black tracking-tight text-ink mb-1">{formatCurrency(annualAmount)}</p>
          <Badge tone={annualChange >= 0 ? 'green' : 'red'}>
            {annualChange >= 0 ? '+' : ''}{annualChange.toFixed(1)}% vs last year
          </Badge>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-1 bg-surface rounded-xl p-1 border border-ink/5">
          {CATEGORY_FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === f ? 'bg-primary text-ink' : 'text-body hover:text-ink'}`}>
              {f}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 flex-1 min-w-45 bg-surface rounded-xl px-4 py-2.5 border border-ink/10">
          <Search size={16} className="text-mute" />
          <input type="text" placeholder="Search recurring..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-sm text-ink bg-transparent focus:outline-none placeholder:text-mute" />
          {search && <button onClick={() => setSearch('')} className="text-mute hover:text-ink"><X size={14} /></button>}
        </div>
        
        <ActionButton icon={Filter} variant="outline" onClick={() => setIsFilterModalOpen(true)}>Filter</ActionButton>
        
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
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-soft flex items-center justify-center text-lg shrink-0">{item.icon || '📋'}</div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{item.name}</p>
                        <p className="text-xs text-mute">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4"><Badge tone={getCategoryTone(item.category)}>{item.category}</Badge></td>
                  <td className="py-4 pr-4 text-sm font-semibold text-ink">{formatCurrency(item.amount)}</td>
                  <td className="py-4 pr-4 text-sm text-body">{item.frequency}</td>
                  <td className="py-4 pr-4 text-sm text-body">{formatDate(item.next_payment)}</td>
                  <td className="py-4 pr-4">
                    <button onClick={() => handleToggleStatus(item)} className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${item.status === 'active' ? 'bg-positive/20 text-positive hover:bg-positive/30' : 'bg-mute/20 text-mute hover:bg-mute/30'}`}>
                      {item.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                   </td>
                  <td className="py-4">
                    <div className="relative">
                      <button onClick={() => setActionMenuOpen(actionMenuOpen === item.id ? null : item.id)} className="w-8 h-8 rounded-full hover:bg-surface-soft flex items-center justify-center transition-colors">
                        <MoreHorizontal size={16} className="text-mute" />
                      </button>
                      {actionMenuOpen === item.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-surface rounded-xl shadow-lg border border-ink/5 z-10 overflow-hidden">
                          <button onClick={() => { handleEdit(item); setActionMenuOpen(null) }} className="w-full px-4 py-2 text-left text-sm text-ink hover:bg-surface-soft flex items-center gap-2">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => { setDeletingItem(item); setIsDeleteModalOpen(true); setActionMenuOpen(null) }} className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-red-50 flex items-center gap-2">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-mute">
                    <AlertCircle size={32} className="mx-auto mb-2 text-mute/50" />
                    No recurring payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Savings Banner */}
      {activeItems.length > 0 && (
        <div className="bg-ink rounded-2xl p-5 flex items-center gap-4 flex-wrap">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl shrink-0">🐷</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-semibold">You can save up to <span className="text-primary font-black">{formatCurrency(Math.round(totalMonthly * 0.15))}</span> per month by reviewing unused subscriptions.</p>
            <p className="text-xs text-white/50">Review your subscriptions and cancel what you don't use.</p>
          </div>
          <button onClick={handleReviewSubscriptions} className="px-5 py-2.5 bg-primary text-ink text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors shrink-0 flex items-center gap-2">
            <Eye size={16} /> Review Subscriptions →
          </button>
        </div>
      )}

      {/* Modals */}
      <RecurringFormModal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setEditingItem(null) }} 
        onSave={handleSave}
        editingItem={editingItem}
      />
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => { setIsDeleteModalOpen(false); setDeletingItem(null) }} 
        onConfirm={handleDelete}
        itemName={deletingItem?.name}
      />
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