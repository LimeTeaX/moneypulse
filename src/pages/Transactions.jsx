// src/pages/Transactions.jsx
// ─────────────────────────────────────────────
// Transactions Page — Full CRUD with Supabase
// Filter, search, export CSV, delete transaction
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import {
  ArrowDownRight, ArrowUpRight, BarChart3,
  ChevronRight, Filter, Plus, Search, TrendingDown, TrendingUp, X, Download
} from 'lucide-react'
import {
  ActionButton, Badge, Card, IconTile, MetricCard,
  Modal, FormGroup, Input, Select
} from '../components/common'
import { useTransactions } from '../hooks/useTransactions'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// ─────────────────────────────────────────────
// Add Transaction Modal
// ─────────────────────────────────────────────
function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [formName, setFormName] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formType, setFormType] = useState('expense')
  const [formCategory, setFormCategory] = useState('')
  const [formDetail, setFormDetail] = useState('')

  const categories = {
    expense: ['Food & Drink', 'Shopping', 'Entertainment', 'Bills', 'Transport', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formName || !formAmount) {
      alert('Please fill in name and amount')
      return
    }
    const amountNum = parseFloat(formAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount')
      return
    }
    const finalAmount = formType === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum)
    onAdd({
      name: formName,
      detail: formDetail || '',
      category: formCategory || (formType === 'income' ? 'Salary' : 'Other'),
      date: new Date().toISOString().split('T')[0],
      amount: finalAmount,
      positive: finalAmount > 0,
    })
    onClose()
    setFormName(''); setFormAmount(''); setFormType('expense'); setFormCategory(''); setFormDetail('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit}>
        <FormGroup label="Transaction Type">
          <div className="flex gap-3">
            <button type="button" onClick={() => setFormType('expense')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${formType === 'expense' ? 'bg-danger text-white' : 'bg-red-50 text-danger'}`}>
              Expense
            </button>
            <button type="button" onClick={() => setFormType('income')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${formType === 'income' ? 'bg-positive text-white' : 'bg-primary-pale text-positive'}`}>
              Income
            </button>
          </div>
        </FormGroup>
        <FormGroup label="Category">
          <Select value={formCategory} onChange={e => setFormCategory(e.target.value)}>
            <option value="">Select category</option>
            {categories[formType].map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormGroup>
        <FormGroup label="Transaction Name *">
          <Input required value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g., Groceries, Salary" />
        </FormGroup>
        <FormGroup label="Amount (IDR) *">
          <Input type="number" required value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0" />
        </FormGroup>
        <FormGroup label="Description (Optional)">
          <Input value={formDetail} onChange={e => setFormDetail(e.target.value)} placeholder="Additional notes..." />
        </FormGroup>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">Add Transaction</button>
        </div>
      </form>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Filter Modal
// ─────────────────────────────────────────────
function FilterModal({ isOpen, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters)

  useEffect(() => {
    setLocal(filters)
  }, [filters, isOpen])

  const reset = { dateRange: 'all', type: 'all', category: 'all' }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Transactions">
      <FormGroup label="Date Range">
        <Select value={local.dateRange} onChange={e => setLocal({ ...local, dateRange: e.target.value })}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </Select>
      </FormGroup>
      <FormGroup label="Transaction Type">
        <Select value={local.type} onChange={e => setLocal({ ...local, type: e.target.value })}>
          <option value="all">All</option>
          <option value="income">Income Only</option>
          <option value="expense">Expense Only</option>
        </Select>
      </FormGroup>
      <FormGroup label="Category">
        <Select value={local.category} onChange={e => setLocal({ ...local, category: e.target.value })}>
          <option value="all">All Categories</option>
          <option value="Food & Drink">Food & Drink</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Bills">Bills</option>
          <option value="Transport">Transport</option>
          <option value="Income">Income</option>
        </Select>
      </FormGroup>
      <div className="flex gap-3 mt-6">
        <button type="button" onClick={() => { setLocal(reset); onApply(reset); onClose() }}
          className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Reset</button>
        <button type="button" onClick={() => { onApply(local); onClose() }}
          className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">Apply Filters</button>
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Transaction Detail Modal
// ─────────────────────────────────────────────
function TransactionDetailModal({ isOpen, onClose, transaction, onDelete }) {
  if (!isOpen || !transaction) return null

  const handleDelete = () => {
    if (confirm(`Delete "${transaction.name}"?`)) {
      onDelete(transaction.id)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-ink/5">
        <IconTile icon={transaction.positive ? ArrowUpRight : ArrowDownRight} tone={transaction.positive ? 'green' : 'red'} size={28} />
        <div>
          <h3 className="text-lg font-black text-ink">{transaction.name}</h3>
          <p className="text-sm text-mute">{transaction.detail || 'No description'}</p>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-mute">Amount:</span>
          <span className={`text-sm font-semibold ${transaction.positive ? 'text-positive' : 'text-danger'}`}>{transaction.formattedAmount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-mute">Category:</span>
          <Badge tone={transaction.positive ? 'green' : 'gray'}>{transaction.category}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-mute">Date:</span>
          <span className="text-sm text-ink">{transaction.formattedDate}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Close</button>
        <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-50 text-danger text-sm font-semibold hover:bg-red-100 transition-colors">Delete</button>
      </div>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────
const filterTransactions = (list, { dateRange, type, category }) => {
  return list.filter(t => {
    const now = new Date()
    const tDate = new Date(t.date)
    const diffDays = Math.floor((now - tDate) / (1000 * 60 * 60 * 24))
    
    if (dateRange === 'today' && diffDays > 0) return false
    if (dateRange === 'week' && diffDays > 7) return false
    if (dateRange === 'month' && diffDays > 30) return false
    if (dateRange === 'year' && diffDays > 365) return false
    
    if (type === 'income' && !t.positive) return false
    if (type === 'expense' && t.positive) return false
    
    if (category !== 'all' && t.category !== category) return false
    
    return true
  })
}

const searchTransactions = (list, term) => {
  if (!term) return list
  const q = term.toLowerCase()
  return list.filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.category.toLowerCase().includes(q) || 
    (t.detail && t.detail.toLowerCase().includes(q))
  )
}

// ─────────────────────────────────────────────
// Main Transactions Page
// ─────────────────────────────────────────────
export default function TransactionsPage({ onNavigate }) {
  const { user } = useAuth()
  const { transactions, addTransaction, deleteTransaction, fetchTransactions, loading } = useTransactions()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedTx, setSelectedTx] = useState(null)
  const [filters, setFilters] = useState({ dateRange: 'all', type: 'all', category: 'all' })

  // Format transactions for display
  const formattedTransactions = transactions.map(t => ({
    ...t,
    formattedDate: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    formattedAmount: `${t.positive ? '+' : '-'}Rp${Math.abs(t.amount).toLocaleString('id-ID')}`
  }))

  const filtered = filterTransactions(formattedTransactions, filters)
  const displayed = searchTransactions(filtered, searchTerm)

  const totalIncome = transactions.filter(t => t.positive).reduce((s, t) => s + t.amount, 0)
  const totalExpense = Math.abs(transactions.filter(t => !t.positive).reduce((s, t) => s + t.amount, 0))
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0

  const handleAdd = async (newTransaction) => {
    await addTransaction(newTransaction)
    await fetchTransactions()
  }

  const handleDelete = async (id) => {
    await deleteTransaction(id)
    await fetchTransactions()
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Category', 'Date', 'Amount'],
      ...displayed.map(t => [t.name, t.category, t.formattedDate, t.formattedAmount])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const hasFilter = filters.dateRange !== 'all' || filters.type !== 'all' || filters.category !== 'all'
  const filterLabels = {
    today: 'Today', week: 'This Week', month: 'This Month', year: 'This Year',
    income: 'Income Only', expense: 'Expense Only',
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
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Transaction History</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-ink leading-none mb-2">Manage your cash flow.</h1>
          <p className="text-base text-body max-w-lg">Track every expense, income, and recurring payment in one clean workspace.</p>
        </div>
        <ActionButton icon={Plus} onClick={() => setIsAddOpen(true)}>Add Transaction</ActionButton>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard icon={TrendingUp} title="Total Income" value={`Rp${totalIncome.toLocaleString('id-ID')}`} change="+8.1%" note="this month" />
        <MetricCard icon={TrendingDown} title="Total Expenses" value={`Rp${totalExpense.toLocaleString('id-ID')}`} change="-2.4%" note="this month" tone="red" />
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-mute mb-1">Savings Rate</p>
              <p className="text-2xl font-black tracking-tight text-ink">{savingsRate}%</p>
            </div>
            <IconTile icon={BarChart3} />
          </div>
          <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden mb-2">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${savingsRate}%` }} />
          </div>
          <p className="text-xs text-mute">of income saved</p>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex items-center gap-2 flex-1 min-w-50 bg-surface rounded-xl px-4 py-3 border border-ink/10">
          <Search size={18} className="text-mute shrink-0" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 text-sm text-ink bg-transparent focus:outline-none placeholder:text-mute"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-mute hover:text-ink">
              <X size={15} />
            </button>
          )}
        </div>
        <ActionButton icon={Filter} variant="outline" onClick={() => setIsFilterOpen(true)}>Filter</ActionButton>
        <ActionButton icon={Download} variant="outline" onClick={handleExport}>Export</ActionButton>
      </div>

      {/* Active Filter Badges */}
      {hasFilter && (
        <div className="flex gap-2 flex-wrap">
          {filters.dateRange !== 'all' && <Badge tone="blue">{filterLabels[filters.dateRange]}</Badge>}
          {filters.type !== 'all' && <Badge tone={filters.type === 'income' ? 'green' : 'red'}>{filterLabels[filters.type]}</Badge>}
          {filters.category !== 'all' && <Badge tone="orange">{filters.category}</Badge>}
          <button onClick={() => setFilters({ dateRange: 'all', type: 'all', category: 'all' })}
            className="text-xs text-mute hover:text-ink underline">Clear all</button>
        </div>
      )}

      {/* Transaction Table */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black tracking-tight text-ink">All Transactions</h2>
            <p className="text-sm text-mute">{displayed.length} transactions found</p>
          </div>
        </div>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-140">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Transaction</th>
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Category</th>
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Date</th>
                <th className="text-right text-xs font-black uppercase tracking-wider text-mute pb-3">Amount</th>
                <th className="w-8"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {displayed.map(t => (
                <tr key={t.id} onClick={() => setSelectedTx(t)} className="hover:bg-surface-soft/50 cursor-pointer transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <IconTile icon={t.positive ? ArrowUpRight : ArrowDownRight} tone={t.positive ? 'green' : 'gray'} size={16} />
                      <div>
                        <p className="text-sm font-semibold text-ink">{t.name}</p>
                        <p className="text-xs text-mute">{t.detail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4"><Badge tone={t.positive ? 'green' : 'gray'}>{t.category}</Badge></td>
                  <td className="py-3.5 pr-4 text-sm text-body">{t.formattedDate}</td>
                  <td className={`py-3.5 pr-2 text-right text-sm font-semibold ${t.positive ? 'text-positive' : 'text-ink'}`}>{t.formattedAmount}</td>
                  <td className="py-3.5"><ChevronRight size={16} className="text-mute" /></td>
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-mute text-sm">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <AddTransactionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filters={filters} onApply={setFilters} />
      <TransactionDetailModal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} transaction={selectedTx} onDelete={handleDelete} />
    </>
  )
}