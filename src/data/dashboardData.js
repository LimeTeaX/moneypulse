// src/data/dashboardData.js
import { ArrowDownRight, TrendingUp, WalletCards } from 'lucide-react'

export const dashboardStats = [
  {
    title: 'Total Balance',
    value: 'Rp12.450.000',
    change: '+12.5%',
    icon: WalletCards,
    tone: 'green',
  },
  {
    title: 'Monthly Income',
    value: 'Rp8.200.000',
    change: '+8.1%',
    icon: TrendingUp,
    tone: 'green',
  },
  {
    title: 'Monthly Expense',
    value: 'Rp3.850.000',
    change: '-2.4%',
    icon: ArrowDownRight,
    tone: 'red',
  },
]