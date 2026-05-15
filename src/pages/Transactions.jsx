// src/pages/Transactions.jsx
// Full Tailwind refactor — preserves all logic (add, delete, filter, search, export)

import { useState } from 'react'
import {
  ArrowDownRight, ArrowUpRight, BarChart3,
  ChevronRight, Filter, Plus, Search, TrendingDown, TrendingUp, X, Download
} from 'lucide-react'
import {
  ActionButton, Badge, Card, IconTile, MetricCard,
  Modal, FormGroup, Input, Select
} from '../components/common'

// ─── Helpers ──────────────────────────────────
function filterTransactions(list, { dateRange, type, category }) {
  return list.filter(t => {
    const now = new Date()
    if (dateRange === 'today') { if (t.date !== now.toISOString().split('T')[0]) return false }
    else if (dateRange === 'week') { const d = new Date(t.date); const diff = (now - d) / 86400000; if (diff > 7) return false }
    else if (dateRange === 'month') { const d = new Date(t.date); if (d.getMonth() !== now.getMonth()) return false }
    else if (dateRange === 'year') { const d = new Date(t.date); if (d.getFullYear() !== now.getFullYear()) return false }
    if (type === 'income' && !t.positive) return false
    if (type === 'expense' && t.positive) return false
    if (category !== 'all' && t.category !== category) return false
    return true
  })
}

function searchTransactions(list, term) {
  if (!term) return list
  const q = term.toLowerCase()
  return list.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.detail.toLowerCase().includes(q))
}

// ─── Add Transaction Modal ────────────────────
function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [formName, setFormName]         = useState('')
  const [formAmount, setFormAmount]     = useState('')
  const [formType, setFormType]         = useState('expense')
  const [formCategory, setFormCategory] = useState('')
  const [formDetail, setFormDetail]     = useState('')

  const categories = {
    expense: ['Food & Drink','Shopping','Entertainment','Bills','Transport','Healthcare','Other'],
    income:  ['Salary','Freelance','Investment','Gift','Other'],
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formName || !formAmount) return alert('Please fill in name and amount')
    const amountNum = parseFloat(formAmount)
    if (isNaN(amountNum) || amountNum <= 0) return alert('Please enter a valid amount')
    const finalAmount = formType === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum)
    onAdd({
      id: Date.now(), name: formName, detail: formDetail || '',
      category: formCategory || (formType === 'income' ? 'Salary' : 'Other'),
      date: new Date().toISOString().split('T')[0],
      formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: finalAmount,
      formattedAmount: `${finalAmount > 0 ? '+' : '-'}Rp${Math.abs(finalAmount).toLocaleString('id-ID')}`,
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
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-colors">Add Transaction</button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Filter Modal ─────────────────────────────
function FilterModal({ isOpen, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters)
  if (!isOpen) return null
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
          {['Food & Drink','Shopping','Entertainment','Bills','Transport','Income'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </FormGroup>
      <div className="flex gap-3 mt-6">
        <button type="button" onClick={() => { setLocal(reset); onApply(reset); onClose() }}
          className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft transition-colors">
          Reset
        </button>
        <button type="button" onClick={() => { onApply(local); onClose() }}
          className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-colors">
          Apply Filters
        </button>
      </div>
    </Modal>
  )
}

// ─── Transaction Detail Modal ─────────────────
function TransactionDetailModal({ isOpen, onClose, transaction: t, onDelete }) {
  if (!isOpen || !t) return null
  const handleDelete = () => {
    if (confirm(`Delete "${t.name}"?`)) { onDelete(t.id); onClose() }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-ink/5">
        <IconTile icon={t.positive ? ArrowUpRight : ArrowDownRight} tone={t.positive ? 'green' : 'red'} size={28} />
        <div>
          <h3 className="text-lg font-black text-ink">{t.name}</h3>
          <p className="text-sm text-mute">{t.detail}</p>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        {[
          ['Amount', <span className={`font-semibold ${t.positive ? 'text-positive' : 'text-danger'}`}>{t.formattedAmount}</span>],
          ['Category', <Badge tone={t.positive ? 'green' : 'gray'}>{t.category}</Badge>],
          ['Date', t.formattedDate],
        ].map(([label, val]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-mute">{label}</span>
            <span className="text-sm text-ink">{val}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft transition-colors">Close</button>
        <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-50 text-danger text-sm font-semibold hover:bg-red-100 transition-colors">Delete</button>
      </div>
    </Modal>
  )
}

// ─── Main Transactions Page ───────────────────
const INITIAL = [
  { id: 1, name: 'Freelance Payment', detail: 'Payment received', category: 'Income', date: '2024-05-20', formattedDate: 'May 20, 2024', amount: 2500000, formattedAmount: '+Rp2.500.000', positive: true },
  { id: 2, name: 'Spotify Premium', detail: 'Monthly subscription', category: 'Entertainment', date: '2024-05-20', formattedDate: 'May 20, 2024', amount: -59000, formattedAmount: '-Rp59.000', positive: false },
  { id: 3, name: 'Coffee Shop', detail: 'Food & Drink', category: 'Food & Drink', date: '2024-05-19', formattedDate: 'May 19, 2024', amount: -45000, formattedAmount: '-Rp45.000', positive: false },
  { id: 4, name: 'Groceries', detail: 'Supermarket', category: 'Shopping', date: '2024-05-18', formattedDate: 'May 18, 2024', amount: -230000, formattedAmount: '-Rp230.000', positive: false },
  { id: 5, name: 'SeaBank Interest', detail: 'Interest received', category: 'Income', date: '2024-05-18', formattedDate: 'May 18, 2024', amount: 12450, formattedAmount: '+Rp12.450', positive: true },
  { id: 6, name: 'Electricity Bill', detail: 'PLN', category: 'Bills', date: '2024-05-15', formattedDate: 'May 15, 2024', amount: -450000, formattedAmount: '-Rp450.000', positive: false },
  { id: 7, name: 'Internet Bill', detail: 'Indihome', category: 'Bills', date: '2024-05-12', formattedDate: 'May 12, 2024', amount: -280000, formattedAmount: '-Rp280.000', positive: false },
  { id: 8, name: 'Netflix', detail: 'Subscription', category: 'Entertainment', date: '2024-05-10', formattedDate: 'May 10, 2024', amount: -149000, formattedAmount: '-Rp149.000', positive: false },
]

export default function TransactionsPage({ transactions: sharedTx, onAddTransaction, onDeleteTransaction }) {
  const [localTransactions, setLocalTransactions] = useState(sharedTx?.length ? sharedTx : INITIAL)
  const [searchTerm, setSearchTerm]               = useState('')
  const [isAddOpen, setIsAddOpen]                 = useState(false)
  const [isFilterOpen, setIsFilterOpen]           = useState(false)
  const [selectedTx, setSelectedTx]               = useState(null)
  const [filters, setFilters]                     = useState({ dateRange: 'all', type: 'all', category: 'all' })

  const filtered  = filterTransactions(localTransactions, filters)
  const displayed = searchTransactions(filtered, searchTerm)

  const totalIncome  = localTransactions.filter(t => t.positive).reduce((s, t) => s + t.amount, 0)
  const totalExpense = Math.abs(localTransactions.filter(t => !t.positive).reduce((s, t) => s + t.amount, 0))
  const savingsRate  = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0

  const handleAdd = (t) => {
    setLocalTransactions(prev => [t, ...prev])
    onAddTransaction?.(t)
  }
  const handleDelete = (id) => {
    setLocalTransactions(prev => prev.filter(t => t.id !== id))
    onDeleteTransaction?.(id)
  }
  const handleExport = () => {
    const csv = [
      ['Name','Category','Date','Amount'],
      ...displayed.map(t => [t.name, t.category, t.formattedDate, t.formattedAmount])
    ].map(r => r.join(',')).join('\n')
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `transactions_${new Date().toISOString().split('T')[0]}.csv` })
    a.click()
  }

  // Active filter badges
  const hasFilter = filters.dateRange !== 'all' || filters.type !== 'all' || filters.category !== 'all'
  const filterLabels = {
    today: 'Today', week: 'This Week', month: 'This Month', year: 'This Year',
    income: 'Income Only', expense: 'Expense Only',
  }

  return (
    <>
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Transaction History</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-ink leading-none mb-2">Manage your cash flow.</h1>
          <p className="text-base text-body max-w-lg">Track every expense, income, and recurring payment in one clean workspace.</p>
        </div>
        <ActionButton icon={Plus} onClick={() => setIsAddOpen(true)}>Add Transaction</ActionButton>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard icon={TrendingUp} title="Total Income" value={`Rp${totalIncome.toLocaleString('id-ID')}`} change="+8.1%" note="this month" />
        <MetricCard icon={TrendingDown} title="Total Expenses" value={`Rp${totalExpense.toLocaleString('id-ID')}`} change="-2.4%" note="this month" tone="red" />
        {/* Savings rate card */}
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

      {/* ── Toolbar ── */}
      <div className="flex gap-3 flex-wrap items-center">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-surface rounded-xl px-4 py-3 border border-ink/10">
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

      {/* ── Active Filter Badges ── */}
      {hasFilter && (
        <div className="flex gap-2 flex-wrap">
          {filters.dateRange !== 'all' && <Badge tone="blue">{filterLabels[filters.dateRange]}</Badge>}
          {filters.type !== 'all' && <Badge tone={filters.type === 'income' ? 'green' : 'red'}>{filterLabels[filters.type]}</Badge>}
          {filters.category !== 'all' && <Badge tone="orange">{filters.category}</Badge>}
          <button onClick={() => setFilters({ dateRange: 'all', type: 'all', category: 'all' })}
            className="text-xs text-mute hover:text-ink underline">
            Clear all
          </button>
        </div>
      )}

      {/* ── Transaction Table ── */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black tracking-tight text-ink">All Transactions</h2>
            <p className="text-sm text-mute">{displayed.length} transactions found</p>
          </div>
        </div>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-ink/5">
                {['Transaction','Category','Date','Amount',''].map((h, i) => (
                  <th key={i} className={`text-xs font-black uppercase tracking-wider text-mute pb-3 ${i === 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
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
                <tr><td colSpan={5} className="text-center py-16 text-mute text-sm">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Modals ── */}
      <AddTransactionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filters={filters} onApply={setFilters} />
      <TransactionDetailModal isOpen={!!selectedTx} onClose={() => setSelectedTx(null)} transaction={selectedTx} onDelete={handleDelete} />
    </>
  )
}
