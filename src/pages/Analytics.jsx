// src/pages/Analytics.jsx
// ─────────────────────────────────────────────
// Analytics Page — Dynamic charts from real Supabase data
// Income vs Expense line chart, Expense breakdown donut, Spending heatmap
// ─────────────────────────────────────────────

import { useState, useMemo } from 'react'
import { Badge, Card, IconTile } from '../components/common'
import { ArrowDownRight, TrendingUp, Target, TrendingDown } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions'

// ─────────────────────────────────────────────
// Helper: group transactions by month
// ─────────────────────────────────────────────
const groupByMonth = (transactions) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
  const monthly = {}
  
  transactions.forEach(t => {
    const date = new Date(t.date)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    const monthLabel = monthNames[date.getMonth()]
    
    if (!monthly[key]) {
      monthly[key] = { label: monthLabel, income: 0, expense: 0, fullDate: date }
    }
    if (t.positive) {
      monthly[key].income += t.amount
    } else {
      monthly[key].expense += Math.abs(t.amount)
    }
  })
  
  const sorted = Object.values(monthly).sort((a, b) => a.fullDate - b.fullDate)
  return sorted.slice(-6)
}

// ─────────────────────────────────────────────
// Income vs Expense Line Chart (SVG)
// ─────────────────────────────────────────────
function LineChart({ incomeData, expenseData, months }) {
  const maxVal = Math.max(...[...incomeData, ...expenseData], 1000)
  const W = 560, H = 200, PAD = { t: 16, b: 32, l: 48, r: 16 }
  
  const x = i => PAD.l + (i / (incomeData.length - 1 || 1)) * (W - PAD.l - PAD.r)
  const y = v => PAD.t + (1 - v / maxVal) * (H - PAD.t - PAD.b)
  
  const path = pts => pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ')
  const area = (pts, color) => {
    if (pts.length === 0) return null
    const d = path(pts) + ` L${x(pts.length - 1)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`
    return <path d={d} fill={color} fillOpacity="0.15" />
  }

  if (incomeData.length === 0 && expenseData.length === 0) {
    return <div className="text-center py-16 text-mute">No transaction data yet</div>
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[320px]" preserveAspectRatio="xMinYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(f => {
          const yy = PAD.t + f * (H - PAD.t - PAD.b)
          return <line key={f} x1={PAD.l} y1={yy} x2={W - PAD.r} y2={yy} stroke="#0e0f0c10" strokeWidth="1" />
        })}
        {/* Y labels */}
        {[maxVal, maxVal * 0.75, maxVal * 0.5, maxVal * 0.25, 0].map((v, i) => (
          <text key={i} x={PAD.l - 6} y={PAD.t + (i / 4) * (H - PAD.t - PAD.b) + 4} textAnchor="end" fontSize="9" fill="#868685">
            {v >= 1000000 ? `Rp${(v / 1000000).toFixed(1)}M` : `Rp${(v / 1000).toFixed(0)}K`}
          </text>
        ))}
        {/* Areas */}
        {incomeData.length > 0 && area(incomeData, '#9fe870')}
        {expenseData.length > 0 && area(expenseData, '#d03238')}
        {/* Lines */}
        {incomeData.length > 0 && <path d={path(incomeData)} fill="none" stroke="#9fe870" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
        {expenseData.length > 0 && <path d={path(expenseData)} fill="none" stroke="#d03238" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
        {/* X labels */}
        {months.map((m, i) => (
          <text key={m} x={x(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#868685">{m}</text>
        ))}
        {/* Dots */}
        {incomeData.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#9fe870" />)}
        {expenseData.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="#d03238" />)}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────
// Expense Donut Chart from real data
// ─────────────────────────────────────────────
function DonutChart({ expensesByCategory }) {
  const total = Object.values(expensesByCategory).reduce((a, b) => a + b, 0)
  if (total === 0) {
    return <div className="text-center py-16 text-mute">No expense data yet</div>
  }

  const R = 80, r = 50, CX = 100, CY = 100
  let angle = -90
  const colors = ['#9fe870', '#ffd11a', '#38c8ff', '#a78bfa', '#ffc091', '#d1d5db', '#f97316', '#ec4899']
  
  const arcs = Object.entries(expensesByCategory).map(([label, amount], idx) => {
    const pct = (amount / total) * 100
    const startAngle = angle
    const sweep = pct * 3.6
    angle += sweep
    const toRad = d => (d * Math.PI) / 180
    const x1 = CX + R * Math.cos(toRad(startAngle))
    const y1 = CY + R * Math.sin(toRad(startAngle))
    const x2 = CX + R * Math.cos(toRad(angle))
    const y2 = CY + R * Math.sin(toRad(angle))
    const xi1 = CX + r * Math.cos(toRad(startAngle))
    const yi1 = CY + r * Math.sin(toRad(startAngle))
    const xi2 = CX + r * Math.cos(toRad(angle))
    const yi2 = CY + r * Math.sin(toRad(angle))
    const lg = sweep > 180 ? 1 : 0
    return { label, pct, d: `M${x1},${y1} A${R},${R},0,${lg},1,${x2},${y2} L${xi2},${yi2} A${r},${r},0,${lg},0,${xi1},${yi1} Z`, color: colors[idx % colors.length] }
  })

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 200 200" className="w-40 h-40 shrink-0">
        {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} />)}
        <text x="100" y="96" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0e0f0c">Rp{(total / 1000000).toFixed(1)}M</text>
        <text x="100" y="111" textAnchor="middle" fontSize="8" fill="#868685">Total Expense</text>
      </svg>
      <div className="flex flex-col gap-2 w-full">
        {arcs.map(s => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-sm text-body">{s.label}</span>
            </div>
            <span className="text-sm font-semibold text-ink">{s.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Spending Heatmap from real data
// ─────────────────────────────────────────────
function Heatmap({ transactions }) {
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  const weeks = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4']
  
  const now = new Date()
  const cells = Array.from({ length: 7 }, () => Array(4).fill(0))
  const counts = Array.from({ length: 7 }, () => Array(4).fill(0))
  
  transactions.forEach(t => {
    if (t.positive) return
    const date = new Date(t.date)
    const diffDays = Math.floor((now - date) / 86400000)
    if (diffDays > 28) return
    const weekIdx = Math.floor(diffDays / 7)
    const dayIdx = date.getDay()
    if (weekIdx >= 0 && weekIdx < 4 && dayIdx >= 0 && dayIdx < 7) {
      cells[dayIdx][weekIdx] += Math.abs(t.amount)
      counts[dayIdx][weekIdx]++
    }
  })
  
  const maxSpend = Math.max(...cells.flat(), 1)
  const intensityClass = val => {
    const intensity = Math.floor((val / maxSpend) * 5)
    const i = Math.min(intensity, 4)
    return ['bg-surface-soft', 'bg-primary/20', 'bg-primary/40', 'bg-primary/70', 'bg-primary'][i]
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-120">
        <div className="flex mb-1 ml-10">
          {weeks.map(w => <div key={w} className="flex-1 text-center text-[9px] text-mute truncate px-0.5">{w}</div>)}
        </div>
        {days.map((day, d) => (
          <div key={day} className="flex items-center gap-1 mb-1">
            <span className="w-9 text-[9px] text-mute text-right pr-2 shrink-0">{day}</span>
            {cells[d].map((val, w) => (
              <div key={w} className={`flex-1 h-6 rounded-sm ${intensityClass(val)}`} title={`Spending: Rp${val.toLocaleString('id-ID')}`} />
            ))}
          </div>
        ))}
        <div className="flex items-center justify-between mt-3 ml-10">
          <span className="text-[9px] text-mute">Low Spending</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(i => <div key={i} className={`w-5 h-3 rounded-sm ${intensityClass(i * maxSpend / 4)}`} />)}
          </div>
          <span className="text-[9px] text-mute">High Spending</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Analytics Page
// ─────────────────────────────────────────────
export default function AnalyticsPage() {
  const { transactions, loading } = useTransactions()
  const [period, setPeriod] = useState('Monthly')

  // Calculate stats from real data
  const totalIncome = transactions?.filter(t => t.positive).reduce((s, t) => s + t.amount, 0) || 0
  const totalExpense = Math.abs(transactions?.filter(t => !t.positive).reduce((s, t) => s + t.amount, 0) || 0)
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0
  const investmentGrowth = 2450000 // placeholder, bisa dikembangkan dengan data investasi real nanti

  // Group by category for donut (only expenses)
  const expensesByCategory = {}
  transactions?.forEach(t => {
    if (!t.positive) {
      const cat = t.category
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + Math.abs(t.amount)
    }
  })

  // Group by month for line chart
  const monthlyData = groupByMonth(transactions || [])
  const incomeData = monthlyData.map(m => m.income)
  const expenseData = monthlyData.map(m => m.expense)
  const months = monthlyData.map(m => m.label)

  const STATS = [
    { label: 'Total Spending', value: `Rp${(totalExpense / 1000000).toFixed(1)}M`, change: '-2.4% vs last month', icon: ArrowDownRight, tone: 'red' },
    { label: 'Total Income', value: `Rp${(totalIncome / 1000000).toFixed(1)}M`, change: '+8.1% vs last month', icon: TrendingUp, tone: 'green' },
    { label: 'Savings Rate', value: `${savingsRate}%`, change: '+5% vs last month', icon: Target, tone: 'green' },
    { label: 'Investment Growth', value: `Rp${(investmentGrowth / 1000000).toFixed(1)}M`, change: '+12.7% vs last month', icon: TrendingUp, tone: 'green' },
  ]

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
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Analytics Overview</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-ink leading-none mb-2">Understand your<br />financial performance.</h1>
          <p className="text-base text-body max-w-lg">Explore your income, expenses, and spending habits with insightful charts and trends.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface rounded-xl px-4 py-2.5 border border-ink/10 text-sm font-semibold">
          📅 {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <Card key={s.label}>
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-mute font-semibold">{s.label}</p>
              <IconTile icon={s.icon} tone={s.tone} size={16} />
            </div>
            <p className="text-xl font-black tracking-tight text-ink mb-1">{s.value}</p>
            <Badge tone={s.tone}>{s.change}</Badge>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black tracking-tight text-ink">Income vs Expense</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary inline-block" />Income</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-danger inline-block" />Expense</span>
              <select value={period} onChange={e => setPeriod(e.target.value)}
                className="text-xs border border-ink/10 rounded-lg px-2 py-1 text-ink bg-surface focus:outline-none">
                {['Monthly', 'Weekly', 'Daily'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <LineChart incomeData={incomeData} expenseData={expenseData} months={months} />
        </Card>

        {/* Donut Chart */}
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-black tracking-tight text-ink mb-4">Expense Breakdown</h2>
          <DonutChart expensesByCategory={expensesByCategory} />
        </Card>
      </div>

      {/* Heatmap + Smart Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <h2 className="text-lg font-black tracking-tight text-ink mb-4">Spending Heatmap</h2>
          <Heatmap transactions={transactions || []} />
        </Card>

        {/* Smart Insight Card */}
        <div className="lg:col-span-2 bg-ink rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">Smart Insight</p>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">🧠</div>
            <div>
              <h3 className="text-xl font-black text-white leading-tight">
                Kamu menghabiskan <span className="text-primary">Rp{(totalExpense * 0.24 / 1000000).toFixed(1)}M</span> lebih banyak untuk pengeluaran bulan ini.
              </h3>
            </div>
          </div>
          <div>
            <p className="text-sm text-white/60 mb-1">Potensi penghematan bulanan</p>
            <p className="text-3xl font-black text-primary">Rp{Math.round(totalExpense * 0.15).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>
    </>
  )
}