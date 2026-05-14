// src/pages/Dashboard.jsx
import { useState } from 'react'

// Simple components tanpa import dari common
function ActionButton({ children, icon: Icon, variant = 'primary', onClick }) {
  return (
    <button 
      className={`action-button action-button--${variant}`} 
      type="button"
      onClick={onClick}
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  )
}

function Badge({ children, tone = 'green' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

function IconTile({ icon: Icon, tone = 'green', size = 24 }) {
  return (
    <div className={`icon-tile icon-tile--${tone}`}>
      <Icon size={size} />
    </div>
  )
}

// Import icons
import { 
  ArrowDownRight, 
  ArrowRight, 
  ArrowUpRight, 
  BarChart3, 
  Plus, 
  TrendingUp, 
  WalletCards,
  X
} from 'lucide-react'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([
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
      id: 3,
      name: 'Groceries',
      detail: 'Supermarket',
      category: 'Shopping',
      date: '2024-05-18',
      formattedDate: 'May 18, 2024',
      amount: -230000,
      formattedAmount: '-Rp230.000',
      positive: false,
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [formName, setFormName] = useState('')
  const [formAmount, setFormAmount] = useState('')
  const [formType, setFormType] = useState('expense')
  const [formDetail, setFormDetail] = useState('')

  // Hitung total balance
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0)
  const monthlyIncome = transactions.filter(t => t.positive).reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpense = Math.abs(transactions.filter(t => !t.positive).reduce((sum, t) => sum + t.amount, 0))

  const handleAddTransaction = (e) => {
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
      category: formType === 'income' ? 'Income' : 'Other',
      date: new Date().toISOString().split('T')[0],
      formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: finalAmount,
      formattedAmount: `${finalAmount > 0 ? '+' : '-'}Rp${Math.abs(finalAmount).toLocaleString('id-ID')}`,
      positive: finalAmount > 0
    }
    
    setTransactions([newTransaction, ...transactions])
    setShowModal(false)
    setFormName('')
    setFormAmount('')
    setFormType('expense')
    setFormDetail('')
    
    alert('Transaction added successfully!')
  }

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Add Transaction</h2>
              <button onClick={() => setShowModal(false)} style={{ cursor: 'pointer', fontSize: '24px', background: 'none', border: 'none' }}>✕</button>
            </div>
            
            <form onSubmit={handleAddTransaction}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Type</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button"
                    onClick={() => setFormType('expense')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: formType === 'expense' ? '#df1f27' : '#fee3e3',
                      color: formType === 'expense' ? 'white' : '#df1f27',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Expense
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormType('income')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: formType === 'income' ? '#23831c' : '#e2f6d5',
                      color: formType === 'income' ? 'white' : '#23831c',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Income
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g., Salary, Groceries"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Amount (IDR) *</label>
                <input
                  type="number"
                  required
                  value={formAmount}
                  onChange={e => setFormAmount(e.target.value)}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description (Optional)</label>
                <input
                  type="text"
                  value={formDetail}
                  onChange={e => setFormDetail(e.target.value)}
                  placeholder="Additional notes"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: 'white',
                  fontWeight: 'bold'
                }}>Cancel</button>
                <button type="submit" style={{
                  flex: 1,
                  padding: '12px',
                  background: '#9fe870',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>Add Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="dashboard-hero">
        <p className="eyebrow">Financial Overview</p>
        <h1>Control your money with clarity.</h1>
        <div className="hero-actions">
          <button 
            onClick={() => setShowModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0 26px',
              minHeight: '52px',
              background: '#9fe870',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
          <button 
            onClick={() => alert('Navigasi ke Analytics')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0 26px',
              minHeight: '52px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <BarChart3 size={18} />
            <span>Analytics</span>
          </button>
        </div>
      </section>

      <div className="dashboard-feature-grid">
        <div className="card balance-feature">
          <p className="card-kicker">Available Balance</p>
          <h2>Rp{totalBalance.toLocaleString('id-ID')}</h2>
          <Badge>+18.2% this month</Badge>
        </div>
        <div className="card savings-feature">
          <p className="card-kicker">Savings Goal</p>
          <h2>72%</h2>
          <div className="progress-track">
            <span style={{ width: '72%' }} />
          </div>
          <p>You are on track to reach your emergency fund target.</p>
        </div>
      </div>

      <div className="dashboard-stat-grid">
        <div className="card dashboard-stat">
          <div className="stat-row">
            <IconTile icon={WalletCards} tone="green" />
            <div>
              <p>Total Balance</p>
              <strong>Rp{totalBalance.toLocaleString('id-ID')}</strong>
            </div>
            <button className="round-icon-button" style={{ flexShrink: 0 }}><ArrowRight size={18} /></button>
          </div>
          <Badge tone="green">+12.5%</Badge>
        </div>
        <div className="card dashboard-stat">
          <div className="stat-row">
            <IconTile icon={TrendingUp} tone="green" />
            <div>
              <p>Monthly Income</p>
              <strong>Rp{monthlyIncome.toLocaleString('id-ID')}</strong>
            </div>
            <button className="round-icon-button" style={{ flexShrink: 0 }}><ArrowRight size={18} /></button>
          </div>
          <Badge tone="green">+8.1%</Badge>
        </div>
        <div className="card dashboard-stat">
          <div className="stat-row">
            <IconTile icon={ArrowDownRight} tone="red" />
            <div>
              <p>Monthly Expense</p>
              <strong>Rp{monthlyExpense.toLocaleString('id-ID')}</strong>
            </div>
            <button className="round-icon-button" style={{ flexShrink: 0 }}><ArrowRight size={18} /></button>
          </div>
          <Badge tone="red">-2.4%</Badge>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-heading">
          <h2>Latest Transactions</h2>
          <p>Your recent financial activity.</p>
        </div>
        <div className="table-wrap">
          <table style={{ width: '100%' }}>
            <thead>
              <tr><th>Transaction</th><th>Category</th><th>Date</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong><br /><span style={{ fontSize: '12px', color: '#666' }}>{t.detail}</span></td>
                  <td><Badge tone={t.positive ? 'green' : 'gray'}>{t.category}</Badge></td>
                  <td>{t.formattedDate}</td>
                  <td className={t.positive ? 'positive-text' : ''}>{t.formattedAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}