// src/pages/Dashboard.jsx
// Full Tailwind refactor — zero custom CSS

import { useState } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight,
  BarChart3, Plus, TrendingUp, WalletCards
} from 'lucide-react'
import {
  Badge, Card, IconTile, ActionButton, Modal,
  FormGroup, Input, Select, RoundIconButton
} from '../components/common'

// ─── Add Transaction Modal ───────────────────
function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [formName, setFormName]     = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formType, setFormType]     = useState('expense')
  const [formDetail, setFormDetail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formName || !formAmount) return alert('Please fill in name and amount')
    const amountNum = parseFloat(formAmount)
    if (isNaN(amountNum) || amountNum <= 0) return alert('Please enter a valid amount')
    const finalAmount = formType === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum)
    onAdd({
      id: Date.now(),
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
            <button
              type="button"
              onClick={() => setFormType('expense')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${formType === 'expense' ? 'bg-danger text-white' : 'bg-red-50 text-danger'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormType('income')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${formType === 'income' ? 'bg-positive text-white' : 'bg-primary-pale text-positive'}`}
            >
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
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-surface-soft transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-colors">
            Add Transaction
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Dashboard Page ──────────────────────────
export default function DashboardPage({ transactions = [], onAddTransaction, onNavigate }) {
  const [showModal, setShowModal] = useState(false)

  // Compute live stats
  const totalBalance    = transactions.reduce((s, t) => s + t.amount, 0)
  const monthlyIncome   = transactions.filter(t => t.positive).reduce((s, t) => s + t.amount, 0)
  const monthlyExpense  = Math.abs(transactions.filter(t => !t.positive).reduce((s, t) => s + t.amount, 0))
  const latest          = transactions.slice(0, 5)

  const stats = [
    { 
      title: 'Total Balance',   
      value: `Rp${totalBalance.toLocaleString('id-ID')}`,   
      change: '+12.5%', 
      icon: WalletCards,   
      tone: 'green',
      navigateTo: 'Transactions'  // Total Balance ke Transactions
    },
    { 
      title: 'Monthly Income',  
      value: `Rp${monthlyIncome.toLocaleString('id-ID')}`,  
      change: '+8.1%',  
      icon: TrendingUp,    
      tone: 'green',
      navigateTo: 'Analytics'     // Monthly Income ke Analytics
    },
    { 
      title: 'Monthly Expense', 
      value: `Rp${monthlyExpense.toLocaleString('id-ID')}`, 
      change: '-2.4%',  
      icon: ArrowDownRight, 
      tone: 'red',
      navigateTo: 'Analytics'     // Monthly Expense ke Analytics
    },
  ]

  return (
    <>
      {/* ── Hero Section ── */}
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

      {/* ── Feature Grid: Balance + Savings ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance card */}
        <Card tone="green">
          <p className="text-xs font-black uppercase tracking-widest text-positive mb-2">Available Balance</p>
          <h2 className="text-4xl font-black tracking-tight text-ink mb-3">Rp{totalBalance.toLocaleString('id-ID')}</h2>
          <Badge tone="green">+18.2% this month</Badge>
        </Card>

        {/* Savings goal card */}
        <Card tone="sage">
          <p className="text-xs font-black uppercase tracking-widest text-mute mb-2">Savings Goal</p>
          <h2 className="text-4xl font-black tracking-tight text-ink mb-3">72%</h2>
          <div className="h-2 rounded-full bg-ink/10 overflow-hidden mb-3">
            <div className="h-full rounded-full bg-positive transition-all" style={{ width: '72%' }} />
          </div>
          <p className="text-sm text-body">You are on track to reach your emergency fund target.</p>
        </Card>
      </div>

      {/* ── Stats Grid dengan Panah navigasi ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(item => (
          <Card key={item.title}>
            <div className="flex items-center gap-3 mb-3">
              <IconTile icon={item.icon} tone={item.tone === 'red' ? 'red' : 'green'} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-mute font-semibold">{item.title}</p>
                <p className="text-lg font-black tracking-tight text-ink truncate">{item.value}</p>
              </div>
              {/* Panah kanan dengan navigasi */}
              <RoundIconButton onClick={() => onNavigate?.(item.navigateTo)} />
            </div>
            <Badge tone={item.tone === 'red' ? 'red' : 'green'}>{item.change}</Badge>
          </Card>
        ))}
      </div>

      {/* ── Transaction Table ── */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black tracking-tight text-ink">Latest Transactions</h2>
            <p className="text-sm text-mute">Your recent financial activity.</p>
          </div>
          <button
            onClick={() => onNavigate?.('Transactions')}
            className="text-sm font-semibold text-positive hover:underline flex items-center gap-1"
          >
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
                  <td className="py-3.5 pr-4">
                    <Badge tone={t.positive ? 'green' : 'gray'}>{t.category}</Badge>
                  </td>
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

      {/* ── Modal ── */}
      <AddTransactionModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={onAddTransaction} />
    </>
  )
}