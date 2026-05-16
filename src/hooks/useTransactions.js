// src/hooks/useTransactions.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchTransactions()
  }, [user])

  const fetchTransactions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
    } else {
      setTransactions(data || [])
    }
    setLoading(false)
  }

const addTransaction = async (transaction) => {
  // Ambil hanya field yang ada di database
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      user_id: user.id,
      name: transaction.name,
      detail: transaction.detail || '',
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      positive: transaction.positive,
    }])
    .select()
    .single()

  if (error) {
    console.error('Error adding transaction:', error)
    return null
  }
  
  setTransactions(prev => [data, ...prev])
  return data
}

  const deleteTransaction = async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting transaction:', error)
      return false
    }
    setTransactions(prev => prev.filter(t => t.id !== id))
    return true
  }

  return { transactions, loading, addTransaction, deleteTransaction, fetchTransactions }
}