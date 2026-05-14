// src/pages/Transactions.jsx
import { useState } from 'react'
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  BarChart3, 
  ChevronRight, 
  Funnel, 
  Plus, 
  Search, 
  TrendingDown, 
  TrendingUp, 
  X,
  Calendar,
  Download
} from 'lucide-react'
import { ActionButton, Badge, Card, IconTile, MetricCard } from '../components/common'

// Component untuk modal tambah transaksi (sama kayak di Dashboard)
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

  if (!isOpen) return null

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
    
    const newTransaction = {
      id: Date.now(),
      name: formName,
      detail: formDetail || '',
      category: formCategory || (formType === 'income' ? 'Salary' : 'Other'),
      date: new Date().toISOString().split('T')[0],
      formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: finalAmount,
      formattedAmount: `${finalAmount > 0 ? '+' : '-'}Rp${Math.abs(finalAmount).toLocaleString('id-ID')}`,
      positive: finalAmount > 0
    }
    
    onAdd(newTransaction)
    onClose()
    setFormName('')
    setFormAmount('')
    setFormType('expense')
    setFormCategory('')
    setFormDetail('')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button onClick={onClose} className="modal-close"><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Transaction Type</label>
            <div className="type-toggle">
              <button type="button" className={`expense ${formType === 'expense' ? 'active' : ''}`} onClick={() => setFormType('expense')}>Expense</button>
              <button type="button" className={`income ${formType === 'income' ? 'active' : ''}`} onClick={() => setFormType('income')}>Income</button>
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={formCategory} onChange={e => setFormCategory(e.target.value)}>
              <option value="">Select category</option>
              {categories[formType].map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Transaction Name *</label>
            <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g., Groceries, Salary" />
          </div>

          <div className="form-group">
            <label>Amount (IDR) *</label>
            <input type="number" required value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0" />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <input type="text" value={formDetail} onChange={e => setFormDetail(e.target.value)} placeholder="Additional notes..." />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Transaction</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Component untuk filter modal
function FilterModal({ isOpen, onClose, filters, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters)

  if (!isOpen) return null

  const handleApply = () => {
    onApply(localFilters)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Filter Transactions</h2>
          <button onClick={onClose} className="modal-close"><X size={24} /></button>
        </div>
        
        <div className="form-group">
          <label>Date Range</label>
          <select value={localFilters.dateRange} onChange={e => setLocalFilters({...localFilters, dateRange: e.target.value})}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="form-group">
          <label>Transaction Type</label>
          <select value={localFilters.type} onChange={e => setLocalFilters({...localFilters, type: e.target.value})}>
            <option value="all">All</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={localFilters.category} onChange={e => setLocalFilters({...localFilters, category: e.target.value})}>
            <option value="all">All Categories</option>
            <option value="Food & Drink">Food & Drink</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
            <option value="Transport">Transport</option>
            <option value="Income">Income</option>
          </select>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={() => { setLocalFilters({ dateRange: 'all', type: 'all', category: 'all' }); onApply({ dateRange: 'all', type: 'all', category: 'all' }); onClose(); }}>Reset</button>
          <button type="button" className="btn-primary" onClick={handleApply}>Apply Filters</button>
        </div>
      </div>
    </div>
  )
}

// Component untuk transaction detail modal
function TransactionDetailModal({ isOpen, onClose, transaction, onDelete }) {
  if (!isOpen || !transaction) return null

  const handleDelete = () => {
    if (confirm(`Delete ${transaction.name}?`)) {
      onDelete(transaction.id)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Transaction Details</h2>
          <button onClick={onClose} className="modal-close"><X size={24} /></button>
        </div>
        
        <div className="transaction-detail-header">
          <IconTile icon={transaction.positive ? ArrowUpRight : ArrowDownRight} tone={transaction.positive ? 'green' : 'red'} size={32} />
          <div>
            <h3>{transaction.name}</h3>
            <p>{transaction.detail || 'No description'}</p>
          </div>
        </div>
        
        <div className="transaction-detail-info">
          <div className="info-row"><span>Amount:</span><strong className={transaction.positive ? 'positive-text' : ''}>{transaction.formattedAmount}</strong></div>
          <div className="info-row"><span>Category:</span><Badge tone={transaction.positive ? 'green' : 'gray'}>{transaction.category}</Badge></div>
          <div className="info-row"><span>Date:</span><span>{transaction.formattedDate}</span></div>
        </div>
        
        <div className="modal-actions">
          <button onClick={handleDelete} className="btn-danger">Delete Transaction</button>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  )
}

// Filter function
const filterTransactions = (transactions, filters) => {
  return transactions.filter(t => {
    // Filter by type
    if (filters.type === 'income' && !t.positive) return false
    if (filters.type === 'expense' && t.positive) return false
    
    // Filter by category
    if (filters.category !== 'all' && t.category !== filters.category) return false
    
    // Filter by date range
    if (filters.dateRange !== 'all') {
      const today = new Date()
      const tDate = new Date(t.date)
      const diffDays = Math.floor((today - tDate) / (1000 * 60 * 60 * 24))
      
      if (filters.dateRange === 'today' && diffDays > 0) return false
      if (filters.dateRange === 'week' && diffDays > 7) return false
      if (filters.dateRange === 'month' && diffDays > 30) return false
      if (filters.dateRange === 'year' && diffDays > 365) return false
    }
    
    return true
  })
}

// Search function
const searchTransactions = (transactions, searchTerm) => {
  if (!searchTerm) return transactions
  const term = searchTerm.toLowerCase()
  return transactions.filter(t => 
    t.name.toLowerCase().includes(term) || 
    t.category.toLowerCase().includes(term) ||
    (t.detail && t.detail.toLowerCase().includes(term))
  )
}

export default function TransactionsPage({ transactions: externalTransactions, onAddTransaction, onDeleteTransaction }) {
  const [localTransactions, setLocalTransactions] = useState(externalTransactions || [
    {
      id: 1,
      name: 'Freelance Payment',
      detail: 'Payment received',
      category: 'Income',
      date: '2024-05-20',
      formattedDate: 'May 20, 2024',
      amount: 2500000,
      formattedAmount: '+Rp2.500.000',
      positive: true,
    },
    {
      id: 2,
      name: 'Spotify Premium',
      detail: 'Monthly subscription',
      category: 'Entertainment',
      date: '2024-05-20',
      formattedDate: 'May 20, 2024',
      amount: -59000,
      formattedAmount: '-Rp59.000',
      positive: false,
    },
    {
      id: 3,
      name: 'Coffee Shop',
      detail: 'Food & Drink',
      category: 'Food & Drink',
      date: '2024-05-19',
      formattedDate: 'May 19, 2024',
      amount: -45000,
      formattedAmount: '-Rp45.000',
      positive: false,
    },
    {
      id: 4,
      name: 'Groceries',
      detail: 'Supermarket',
      category: 'Shopping',
      date: '2024-05-18',
      formattedDate: 'May 18, 2024',
      amount: -230000,
      formattedAmount: '-Rp230.000',
      positive: false,
    },
    {
      id: 5,
      name: 'SeaBank Interest',
      detail: 'Interest received',
      category: 'Income',
      date: '2024-05-18',
      formattedDate: 'May 18, 2024',
      amount: 12450,
      formattedAmount: '+Rp12.450',
      positive: true,
    },
    {
      id: 6,
      name: 'Electricity Bill',
      detail: 'PLN',
      category: 'Bills',
      date: '2024-05-15',
      formattedDate: 'May 15, 2024',
      amount: -450000,
      formattedAmount: '-Rp450.000',
      positive: false,
    },
    {
      id: 7,
      name: 'Internet Bill',
      detail: 'Indihome',
      category: 'Bills',
      date: '2024-05-12',
      formattedDate: 'May 12, 2024',
      amount: -280000,
      formattedAmount: '-Rp280.000',
      positive: false,
    },
    {
      id: 8,
      name: 'Netflix',
      detail: 'Subscription',
      category: 'Entertainment',
      date: '2024-05-10',
      formattedDate: 'May 10, 2024',
      amount: -149000,
      formattedAmount: '-Rp149.000',
      positive: false,
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [filters, setFilters] = useState({ dateRange: 'all', type: 'all', category: 'all' })

  // Hitung statistik
  const filteredByDate = filterTransactions(localTransactions, filters)
  const searchedTransactions = searchTransactions(filteredByDate, searchTerm)
  
  const totalIncome = localTransactions.filter(t => t.positive).reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = Math.abs(localTransactions.filter(t => !t.positive).reduce((sum, t) => sum + t.amount, 0))
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0

  const handleAddTransaction = (newTransaction) => {
    setLocalTransactions([newTransaction, ...localTransactions])
    if (onAddTransaction) onAddTransaction(newTransaction)
  }

  const handleDeleteTransaction = (id) => {
    setLocalTransactions(localTransactions.filter(t => t.id !== id))
    if (onDeleteTransaction) onDeleteTransaction(id)
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Category', 'Date', 'Amount'],
      ...searchedTransactions.map(t => [t.name, t.category, t.formattedDate, t.formattedAmount])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Transaction History</p>
          <h1>Manage your cash flow.</h1>
          <p className="page-lede">Track every expense, income, and recurring payment in one clean workspace.</p>
        </div>
        <div className="page-action">
          <ActionButton icon={Plus} onClick={() => setIsAddModalOpen(true)}>Add Transaction</ActionButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="three-grid">
        <MetricCard icon={TrendingUp} title="Total Income" value={`Rp${totalIncome.toLocaleString('id-ID')}`} change="+8.1%" note="this month" />
        <MetricCard icon={TrendingDown} title="Total Expenses" value={`Rp${totalExpense.toLocaleString('id-ID')}`} change="-2.4%" note="this month" tone="red" />
        <Card className="metric-card">
          <div className="metric-main">
            <div>
              <p className="muted-label">Savings Rate</p>
              <h3>{savingsRate}%</h3>
            </div>
            <IconTile icon={BarChart3} />
          </div>
          <div className="progress-track short">
            <span style={{ width: `${savingsRate}%` }} />
          </div>
          <p className="soft-note">of income saved</p>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="toolbar-row">
        <label className="search-field">
          <Search size={22} />
          <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </label>
        <ActionButton icon={Funnel} variant="secondary" onClick={() => setIsFilterModalOpen(true)}>Filter</ActionButton>
        <ActionButton icon={Download} variant="secondary" onClick={handleExport}>Export</ActionButton>
      </div>

      {/* Active Filters */}
      {(filters.dateRange !== 'all' || filters.type !== 'all' || filters.category !== 'all') && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {filters.dateRange !== 'all' && <Badge tone="blue">{filters.dateRange === 'today' ? 'Today' : filters.dateRange === 'week' ? 'This Week' : filters.dateRange === 'month' ? 'This Month' : 'This Year'}</Badge>}
          {filters.type !== 'all' && <Badge tone={filters.type === 'income' ? 'green' : 'red'}>{filters.type === 'income' ? 'Income Only' : 'Expense Only'}</Badge>}
          {filters.category !== 'all' && <Badge tone="orange">{filters.category}</Badge>}
        </div>
      )}

      {/* Transaction Table */}
      <Card className="table-card">
        <div className="table-heading">
          <div>
            <h2>All Transactions</h2>
            <p>{searchedTransactions.length} transactions found</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Transaction</th><th>Category</th><th>Date</th><th>Amount</th><th /></tr>
            </thead>
            <tbody>
              {searchedTransactions.map((item) => (
                <tr key={item.id} onClick={() => setSelectedTransaction(item)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div className="entity-cell">
                      <IconTile icon={item.positive ? ArrowUpRight : ArrowDownRight} tone={item.positive ? 'green' : 'gray'} size={19} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.detail}</span>
                      </div>
                    </div>
                  </td>
                  <td><Badge tone={item.positive ? 'green' : 'gray'}>{item.category}</Badge></td>
                  <td>{item.formattedDate}</td>
                  <td className={item.positive ? 'positive-text' : ''}>{item.formattedAmount}</td>
                  <td><ChevronRight size={18} /></td>
                </tr>
              ))}
              {searchedTransactions.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px' }}>No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddTransaction} />
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} filters={filters} onApply={setFilters} />
      <TransactionDetailModal isOpen={!!selectedTransaction} onClose={() => setSelectedTransaction(null)} transaction={selectedTransaction} onDelete={handleDeleteTransaction} />
    </>
  )
}