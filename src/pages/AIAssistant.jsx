// src/pages/AIAssistant.jsx
// ─────────────────────────────────────────────
// AI Assistant — powered by Groq API (Strict Finance Only)
// ALL DATA FROM SUPABASE — NO HARDCODE
// ─────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react'
import { 
  Send, TrendingUp, Lightbulb, Target, BarChart3, 
  Sparkles, Wallet, ReceiptText, FileText,
  Bot, Trash2, Copy, Check, Loader2
} from 'lucide-react'
import { Card, IconTile, Badge, ActionButton } from '../components/common'
import { useTransactions } from '../hooks/useTransactions'
import { useAuth } from '../contexts/AuthContext'

// ─────────────────────────────────────────────
// Quick suggestions
// ─────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: TrendingUp, text: 'How can I reduce my monthly expenses?', tone: 'green' },
  { icon: Lightbulb, text: 'Where did I spend the most this week?', tone: 'orange' },
  { icon: Target, text: 'How can I reach my savings goal faster?', tone: 'purple' },
  { icon: BarChart3, text: 'Analyze my spending patterns', tone: 'blue' },
]

const QUICK_ACTIONS = [
  { icon: ReceiptText, label: 'Analyze Spending', prompt: 'Analyze my spending patterns and suggest 3 ways to cut back.' },
  { icon: Wallet, label: 'Budget Review', prompt: 'Review my monthly budget using the 50/30/20 rule.' },
  { icon: FileText, label: 'Expense Report', prompt: 'Generate a summary of my expenses this month.' },
  { icon: Sparkles, label: 'Savings Tips', prompt: 'Give me 5 actionable saving tips based on my spending.' },
]

// ─────────────────────────────────────────────
// Helper: Calculate percentage change
// ─────────────────────────────────────────────
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// ─────────────────────────────────────────────
// Helper: Get last month totals
// ─────────────────────────────────────────────
const getLastMonthComparison = (transactions) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  let currentIncome = 0
  let lastIncome = 0
  let currentExpense = 0
  let lastExpense = 0

  transactions?.forEach(t => {
    const date = new Date(t.date)
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      if (t.positive) currentIncome += t.amount
      else currentExpense += Math.abs(t.amount)
    }
    if (date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear) {
      if (t.positive) lastIncome += t.amount
      else lastExpense += Math.abs(t.amount)
    }
  })

  return {
    currentIncome,
    lastIncome,
    currentExpense,
    lastExpense,
    incomeChange: calculatePercentageChange(currentIncome, lastIncome),
    expenseChange: calculatePercentageChange(currentExpense, lastExpense)
  }
}

// ─────────────────────────────────────────────
// Call Groq API (Strict Finance Only)
// ─────────────────────────────────────────────
async function callGroq(messages, transactions, totalBalance, monthlyIncome, monthlyExpense) {
  const categories = {}
  transactions?.filter(t => !t.positive).forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount)
  })
  const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1])
  
  const financialContext = `
Current financial status:
- Balance: Rp${totalBalance.toLocaleString('id-ID')}
- Monthly Income: Rp${monthlyIncome.toLocaleString('id-ID')}
- Monthly Expenses: Rp${monthlyExpense.toLocaleString('id-ID')}
- Savings Rate: ${monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100) : 0}%

Top spending categories:
${sortedCats.slice(0, 5).map(([cat, amt]) => `- ${cat}: Rp${amt.toLocaleString('id-ID')}`).join('\n')}

Recent transactions:
${transactions?.slice(0, 5).map(t => `- ${t.name}: ${t.positive ? '+' : '-'}Rp${Math.abs(t.amount).toLocaleString('id-ID')} (${t.category})`).join('\n')}
`

  const systemPrompt = `You are MoneyPulse Assistant, a **strictly financial-only AI**. You are embedded in a personal finance app.

🔒 STRICT RULES (MUST FOLLOW):
1. ONLY answer questions about personal finance, budgeting, saving, investing, and money management
2. If user asks about CODING, PROGRAMMING, or any NON-FINANCE topic, politely DECLINE and redirect
3. ALWAYS use the financial data above to give personalized advice
4. Use Indonesian Rupiah (IDR) for all amounts
5. Keep responses concise (2-4 sentences max) and actionable

${financialContext}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'API Error')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Groq API error:', error)
    return "I'm having trouble connecting right now. Please check your API key in the .env file."
  }
}

// ─────────────────────────────────────────────
// Message bubble with copy
// ─────────────────────────────────────────────
function MessageBubble({ msg, onCopy }) {
  const isUser = msg.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-ink font-black text-xs shrink-0 mr-2.5 mt-0.5">
          AI
        </div>
      )}
      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed relative ${
        isUser
          ? 'bg-ink text-primary rounded-br-sm'
          : 'bg-surface border border-ink/5 text-body rounded-bl-sm'
      }`}>
        {msg.content}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="absolute -bottom-2 -right-2 p-1 rounded-full bg-surface-soft opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copy response"
          >
            {copied ? <Check size={12} className="text-positive" /> : <Copy size={12} className="text-mute" />}
          </button>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center text-ink font-black text-xs shrink-0 ml-2.5 mt-0.5">
          U
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Stats Card
// ─────────────────────────────────────────────
function StatCard({ label, value, note, icon: Icon, tone = 'green' }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-mute font-semibold leading-tight">{label}</p>
        <IconTile icon={Icon} tone={tone} size={16} />
      </div>
      <p className="text-xl font-black tracking-tight text-ink">{value}</p>
      <p className="text-xs text-mute mt-0.5">{note}</p>
    </Card>
  )
}

// ─────────────────────────────────────────────
// Main AI Assistant Page — NO HARDCODE
// ─────────────────────────────────────────────
export default function AIAssistantPage() {
  const { user } = useAuth()
  const { transactions, loading: txLoading } = useTransactions()
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi! I\'m your MoneyPulse AI assistant. I can see your financial data and give you personalized advice.\n\nAsk me anything about your budget, savings goals, or spending patterns!' 
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // ─── Calculate financial stats from REAL Supabase data ───
  const totalBalance = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
  const monthlyIncome = transactions?.filter(t => t.positive).reduce((sum, t) => sum + (t.amount || 0), 0) || 0
  const monthlyExpense = Math.abs(transactions?.filter(t => !t.positive).reduce((sum, t) => sum + (t.amount || 0), 0) || 0)
  const savingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100) : 0
  const questionsCount = messages.filter(m => m.role === 'user').length

  // ─── Calculate real percentage changes from last month ───
  const { incomeChange, expenseChange } = getLastMonthComparison(transactions)

  // ─── Get top spending category from REAL data ───
  const categories = {}
  transactions?.filter(t => !t.positive).forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount)
  })
  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]
  const topCategoryName = topCategory?.[0] || 'No data'
  const topCategoryAmount = topCategory?.[1] || 0

  // ─── Auto scroll ───
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // ─── Send message to Groq ──────────────────
  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput('')

    const userMsg = { role: 'user', content: userText }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))
      const reply = await callGroq(apiMessages, transactions, totalBalance, monthlyIncome, monthlyExpense)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check your Groq API key and try again.' 
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    if (confirm('Clear all conversation history?')) {
      setMessages([{ 
        role: 'assistant', 
        content: 'Chat cleared! Ready to help with your finances again. Ask me anything! 💚' 
      }])
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (txLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">AI Assistant</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-ink leading-none mb-2">Your smart financial<br />assistant.</h1>
          <p className="text-base text-body">Powered by Groq • Instant responses • Real financial insights</p>
        </div>
        <ActionButton icon={Trash2} variant="outline" onClick={clearChat}>Clear Chat</ActionButton>
      </div>

      {/* Stats Row — ALL REAL DATA, NO HARDCODE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Monthly Income" 
          value={`Rp${monthlyIncome.toLocaleString('id-ID')}`} 
          note={`${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}% vs last month`} 
          icon={TrendingUp} 
          tone={incomeChange >= 0 ? 'green' : 'red'} 
        />
        <StatCard 
          label="Monthly Expense" 
          value={`Rp${monthlyExpense.toLocaleString('id-ID')}`} 
          note={`${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}% vs last month`} 
          icon={TrendingUp} 
          tone={expenseChange <= 0 ? 'green' : 'red'} 
        />
        <StatCard 
          label="Savings Rate" 
          value={`${savingsRate}%`} 
          note={savingsRate > 30 ? 'Excellent!' : savingsRate > 15 ? 'Good progress' : 'Room to improve'} 
          icon={Target} 
          tone={savingsRate > 20 ? 'green' : 'orange'} 
        />
        <StatCard 
          label="Top Category" 
          value={topCategoryName} 
          note={`Rp${topCategoryAmount.toLocaleString('id-ID')} spent`} 
          icon={BarChart3} 
          tone="blue" 
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chat Panel */}
        <Card className="lg:col-span-3 flex flex-col" style={{ height: '560px' }}>
          <div className="flex items-center justify-between pb-4 border-b border-ink/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-ink font-black text-sm">AI</div>
              <div>
                <p className="text-sm font-black text-ink">MoneyPulse Assistant</p>
                <p className="text-xs text-mute">Groq • Llama 3.1 • Instant</p>
              </div>
            </div>
            <Badge tone="green">Online</Badge>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1" style={{ maxHeight: '420px' }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} onCopy={handleCopy} />
            ))}
            {loading && (
              <div className="flex justify-start mb-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-ink font-black text-xs shrink-0 mr-2.5">AI</div>
                <div className="bg-surface border border-ink/5 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-mute flex items-center gap-1">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="mt-auto pt-4 border-t border-ink/5 shrink-0">
            <div className="flex items-center gap-2 bg-surface-soft rounded-xl px-4 py-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your finances..."
                className="flex-1 text-sm text-ink bg-transparent focus:outline-none placeholder:text-mute"
                disabled={loading}
              />
              <button 
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-ink hover:bg-primary-hover transition-colors disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="text-xs text-mute mt-2 text-center">Powered by Groq • Responses use your actual financial data</p>
          </div>
        </Card>

        {/* Right Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* AI Insight Card — REAL DATA */}
          <div className="bg-ink rounded-2xl p-6">
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">AI Insight</p>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                {monthlyExpense > monthlyIncome ? '⚠️' : '📈'}
              </div>
              <div>
                <h3 className="text-xl font-black text-white leading-tight">
                  {monthlyExpense > monthlyIncome 
                    ? `Your expenses exceed income by ` 
                    : `You're saving ${savingsRate}% of your income! `}
                  <span className="text-primary">
                    {monthlyExpense > monthlyIncome 
                      ? `Rp${(monthlyExpense - monthlyIncome).toLocaleString('id-ID')}`
                      : `Great job!`}
                  </span>
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-white/60 mb-1">Potential monthly savings</p>
              <p className="text-3xl font-black text-primary">
                Rp{Math.round(monthlyExpense * 0.15).toLocaleString('id-ID')}
              </p>
            </div>
            <button 
              onClick={() => sendMessage('How can I save more money based on my actual spending?')}
              className="w-full py-2.5 rounded-xl bg-primary text-ink text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              Get Personalized Tips →
            </button>
          </div>

          {/* Quick Questions */}
          <Card>
            <p className="text-xs font-black uppercase tracking-wider text-mute mb-3">Quick Questions</p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map(s => (
                <button 
                  key={s.text} 
                  onClick={() => sendMessage(s.text)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-soft text-left transition-colors group"
                >
                  <IconTile icon={s.icon} tone={s.tone} size={15} />
                  <span className="text-sm text-body group-hover:text-ink">{s.text}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <p className="text-xs font-black uppercase tracking-wider text-mute mb-3">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map(a => (
                <button 
                  key={a.label} 
                  onClick={() => sendMessage(a.prompt)}
                  className="px-3 py-2 rounded-xl bg-surface-soft hover:bg-primary-pale text-sm font-semibold text-ink transition-colors flex items-center gap-1.5"
                >
                  <a.icon size={14} /> {a.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}