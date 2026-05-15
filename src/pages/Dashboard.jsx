// src/pages/Dashboard.jsx
// ─────────────────────────────────────────────
// Dashboard Page — Available Balance & Savings Goal connected to Supabase
// Full Tailwind, all functions working, Edit Goal with Modal
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight,
  BarChart3, Plus, TrendingUp, WalletCards
} from 'lucide-react'
import {
  Badge, Card, IconTile, ActionButton, Modal,
  FormGroup, Input, Select, RoundIconButton
} from '../components/common'
import { useTransactions } from '../hooks/useTransactions'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

// ─────────────────────────────────────────────
// Add Transaction Modal
// ─────────────────────────────────────────────
function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [formName, setFormName] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formType, setFormType] = useState('expense')
  const [formDetail, setFormDetail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formName || !formAmount) return alert('Please fill in name and amount')
    const amountNum = parseFloat(formAmount)
    if (isNaN(amountNum) || amountNum <= 0) return alert('Please enter a valid amount')
    const finalAmount = formType === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum)
    onAdd({
      id: Date.now().toString(),
      name: formName,
      detail: formDetail || '',
      category: formType === 'income' ? 'Income' : 'Other',
      date: new Date().toISOString().split('T')[0],
      formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: finalAmount,
      formattedAmount: `${finalAmount > 0 ? '+' : '-'}Rp${Math.abs(finalAmount).toLocaleString('id-ID')}`,
      positive: finalAmount > 0,
    })
    onClose()
    setFormName(''); setFormAmount(''); setFormType('expense'); setFormDetail('')
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
        <FormGroup label="Name *">
          <Input required value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g., Salary, Groceries" />
        </FormGroup>
        <FormGroup label="Amount (IDR) *">
          <Input type="number" required value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0" />
        </FormGroup>
        <FormGroup label="Description">
          <Input value={formDetail} onChange={e => setFormDetail(e.target.value)} placeholder="Additional notes" />
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
// Modal Edit Savings Goal
// ─────────────────────────────────────────────
function EditGoalModal({ isOpen, onClose, onSave, currentTarget, currentName }) {
  const [target, setTarget] = useState(currentTarget)
  const [name, setName] = useState(currentName)

  useEffect(() => {
    setTarget(currentTarget)
    setName(currentName)
  }, [currentTarget, currentName, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!target || target <= 0) {
      alert('Please enter a valid target amount')
      return
    }
    onSave({ target, name })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Savings Goal">
      <form onSubmit={handleSubmit}>
        <FormGroup label="Goal Name">
          <Input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="e.g., Emergency Fund, Vacation, House Down Payment"
          />
        </FormGroup>
        <FormGroup label="Target Amount (IDR)">
          <Input 
            type="number" 
            value={target} 
            onChange={e => setTarget(parseInt(e.target.value) || 0)} 
            placeholder="0"
          />
        </FormGroup>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover">Save Goal</button>
        </div>
      </form>
    </Modal>
  )
}

// ─────────────────────────────────────────────
// Dashboard Page Main Component
// ─────────────────────────────────────────────
export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth()
  const { transactions, addTransaction, deleteTransaction, loading } = useTransactions()
  const [showModal, setShowModal] = useState(false)
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false)
  const [savingsTarget, setSavingsTarget] = useState(10000000)
  const [savingsName, setSavingsName] = useState('Emergency Fund')

  // ─── Fetch savings goal from Supabase ───
  useEffect(() => {
    if (!user) return
    fetchSavingsGoal()
  }, [user])

  const fetchSavingsGoal = async () => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('savings_target, savings_name')
      .eq('user_id', user.id)
      .single()
    
    if (data && !error) {
      setSavingsTarget(data.savings_target || 10000000)
      setSavingsName(data.savings_name || 'Emergency Fund')
    }
  }

  const updateSavingsGoal = async (target, name) => {
    const { error } = await supabase
      .from('user_settings')
      .update({ savings_target: target, savings_name: name })
      .eq('user_id', user.id)
    
    if (!error) {
      setSavingsTarget(target)
      setSavingsName(name)
    }
  }

  // ─── Helper functions for statistics ───
  const getMonthYear = (date) => {
    const d = new Date(date)
    return `${d.getFullYear()}-${d.getMonth()}`
  }

  const calculateMonthlyTotals = (transactions) => {
    const monthly = {}
    transactions.forEach(t => {
      const monthKey = getMonthYear(t.date)
      if (!monthly[monthKey]) {
        monthly[monthKey] = { income: 0, expense: 0 }
      }
      if (t.positive) {
        monthly[monthKey].income += t.amount
      } else {
        monthly[monthKey].expense += Math.abs(t.amount)
      }
    })
    return monthly
  }

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const formatPercent = (value) => {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  // ─── Calculate all stats from real data ───
  const totalBalance = transactions?.reduce((s, t) => s + (t.amount || 0), 0) || 0
  const savingsPercentage = Math.min(100, Math.round((totalBalance / savingsTarget) * 100))
  
  const monthlyTotals = calculateMonthlyTotals(transactions || [])
  const months = Object.keys(monthlyTotals).sort().reverse()
  const currentMonth = months[0]
  const previousMonth = months[1]

  const currentIncome = currentMonth ? monthlyTotals[currentMonth].income : 0
  const previousIncome = previousMonth ? monthlyTotals[previousMonth].income : 0
  const incomeChange = calculatePercentageChange(currentIncome, previousIncome)

  const currentExpense = currentMonth ? monthlyTotals[currentMonth].expense : 0
  const previousExpense = previousMonth ? monthlyTotals[previousMonth].expense : 0
  const expenseChange = calculatePercentageChange(currentExpense, previousExpense)

  const currentBalance = currentIncome - currentExpense
  const previousBalance = previousIncome - previousExpense
  const balanceChange = calculatePercentageChange(currentBalance, previousBalance)

  const latest = transactions?.slice(0, 5) || []

  const stats = [
    { title: 'Total Balance', value: `Rp${totalBalance.toLocaleString('id-ID')}`, change: formatPercent(balanceChange), icon: WalletCards, tone: balanceChange >= 0 ? 'green' : 'red', navigateTo: 'Transactions' },
    { title: 'Monthly Income', value: `Rp${currentIncome.toLocaleString('id-ID')}`, change: formatPercent(incomeChange), icon: TrendingUp, tone: incomeChange >= 0 ? 'green' : 'red', navigateTo: 'Analytics' },
    { title: 'Monthly Expense', value: `Rp${currentExpense.toLocaleString('id-ID')}`, change: formatPercent(expenseChange), icon: ArrowDownRight, tone: expenseChange <= 0 ? 'green' : 'red', navigateTo: 'Analytics' },
  ]

  const handleAdd = async (newTransaction) => {
    await addTransaction(newTransaction)
  }

  const handleEditGoal = () => {
    setIsEditGoalOpen(true)
  }

  const handleSaveGoal = ({ target, name }) => {
    updateSavingsGoal(target, name)
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
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="bg-surface rounded-2xl p-8">
        <p className="text-xs font-black uppercase tracking-widest text-primary mb-3">Financial Overview</p>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-ink leading-none mb-3">
          Control your money<br />with clarity.
        </h1>
        <p className="text-base text-body mb-6 max-w-lg">
          Track your balance, monitor expenses, and grow your financial health with a cleaner, smarter workflow.
        </p>
        <div className="flex gap-3 flex-wrap">
          <ActionButton icon={Plus} onClick={() => setShowModal(true)}>Add Transaction</ActionButton>
          <ActionButton icon={BarChart3} variant="outline" onClick={() => onNavigate?.('Analytics')}>Analytics</ActionButton>
        </div>
      </section>

      {/* ─── Feature Grid: Available Balance + Savings Goal ────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Available Balance Card */}
        <Card tone="green">
          <p className="text-xs font-black uppercase tracking-widest text-positive mb-2">Available Balance</p>
          <h2 className="text-4xl font-black tracking-tight text-ink mb-3">
            Rp{totalBalance.toLocaleString('id-ID')}
          </h2>
          <Badge tone="green">+{savingsPercentage}% toward goal</Badge>
        </Card>

        {/* Savings Goal Card */}
        <Card tone="sage">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-black uppercase tracking-widest text-mute">Savings Goal</p>
            <button 
              onClick={handleEditGoal}
              className="text-xs text-positive hover:underline font-semibold"
            >
              Edit Goal
            </button>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-ink mb-3">
            {savingsPercentage}%
          </h2>
          <div className="h-2 rounded-full bg-ink/10 overflow-hidden mb-3">
            <div 
              className="h-full rounded-full bg-positive transition-all" 
              style={{ width: `${savingsPercentage}%` }} 
            />
          </div>
          <p className="text-sm text-body">
            {savingsPercentage >= 100 
              ? `🎉 Goal achieved! You've reached Rp${totalBalance.toLocaleString('id-ID')} of Rp${savingsTarget.toLocaleString('id-ID')}`
              : `Rp${totalBalance.toLocaleString('id-ID')} of Rp${savingsTarget.toLocaleString('id-ID')} saved`}
          </p>
        </Card>
      </div>

      {/* ─── Stats Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(item => (
          <Card key={item.title}>
            <div className="flex items-center gap-3 mb-3">
              <IconTile icon={item.icon} tone={item.tone === 'red' ? 'red' : 'green'} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-mute font-semibold">{item.title}</p>
                <p className="text-lg font-black tracking-tight text-ink truncate">{item.value}</p>
              </div>
              <RoundIconButton onClick={() => onNavigate?.(item.navigateTo)} />
            </div>
            <Badge tone={item.tone === 'red' ? 'red' : 'green'}>{item.change}</Badge>
          </Card>
        ))}
      </div>

      {/* ─── Transaction Table ──────────────────────────────────────── */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black tracking-tight text-ink">Latest Transactions</h2>
            <p className="text-sm text-mute">Your recent financial activity.</p>
          </div>
          <button onClick={() => onNavigate?.('Transactions')} className="text-sm font-semibold text-positive hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-120">
            <thead>
              <tr className="border-b border-ink/5">
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Transaction</th>
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Category</th>
                <th className="text-left text-xs font-black uppercase tracking-wider text-mute pb-3">Date</th>
                <th className="text-right text-xs font-black uppercase tracking-wider text-mute pb-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {latest.map(t => (
                <tr key={t.id} className="hover:bg-surface-soft/60 transition-colors cursor-pointer" onClick={() => onNavigate?.('Transactions')}>
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
                  <td className={`py-3.5 text-right text-sm font-semibold ${t.positive ? 'text-positive' : 'text-ink'}`}>
                    {t.formattedAmount}
                  </td>
                </tr>
              ))}
              {latest.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 text-mute text-sm">No transactions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Add Transaction Modal ──────────────────────────────────── */}
      <AddTransactionModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={handleAdd} />

      {/* ─── Edit Savings Goal Modal ────────────────────────────────── */}
      <EditGoalModal 
        isOpen={isEditGoalOpen}
        onClose={() => setIsEditGoalOpen(false)}
        onSave={handleSaveGoal}
        currentTarget={savingsTarget}
        currentName={savingsName}
      />
    </>
  )
}