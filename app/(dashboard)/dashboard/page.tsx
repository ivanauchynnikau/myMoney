'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getPeriodRange, type PeriodType } from '@/lib/utils/date'
import DateNavigator from '@/components/dashboard/DateNavigator'
import BalanceCard from '@/components/dashboard/BalanceCard'
import ActionButtons from '@/components/dashboard/ActionButtons'
import DonutChart from '@/components/dashboard/DonutChart'
import CategoryGrid from '@/components/dashboard/CategoryGrid'
import TransactionModal from '@/components/transaction/TransactionModal'
import type { Category, Transaction } from '@/types/database.types'

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [period, setPeriod] = useState<PeriodType>('month')
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [availableDates, setAvailableDates] = useState<Date[]>([new Date()])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'expense' | 'income'>('expense')
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadUserSettings()
  }, [])

  useEffect(() => {
    loadData()
  }, [currentDate, period])

  async function loadUserSettings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('period')
      .eq('id', user.id)
      .single()

    if (profile?.period) {
      setPeriod(profile.period as PeriodType)
    }
  }

  async function loadData() {
    setLoading(true)
    const { start, end } = getPeriodRange(currentDate, period)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [categoriesRes, transactionsRes, allTransactionsRes] = await Promise.all([
      supabase.from('categories').select('*').eq('user_id', user.id).order('position'),
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('transaction_date', start.toISOString())
        .lte('transaction_date', end.toISOString()),
      supabase
        .from('transactions')
        .select('transaction_date')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
    ])

    if (categoriesRes.data) setCategories(categoriesRes.data)
    if (transactionsRes.data) setTransactions(transactionsRes.data)

    // Получаем уникальные месяцы с данными
    if (allTransactionsRes.data && allTransactionsRes.data.length > 0) {
      const uniqueMonths = new Map<string, Date>()
      allTransactionsRes.data.forEach(t => {
        const date = new Date(t.transaction_date)
        const key = `${date.getFullYear()}-${date.getMonth()}`
        if (!uniqueMonths.has(key)) {
          uniqueMonths.set(key, new Date(date.getFullYear(), date.getMonth(), 1))
        }
      })
      const months = Array.from(uniqueMonths.values()).sort((a, b) => a.getTime() - b.getTime())
      setAvailableDates(months)
      
      // Устанавливаем текущую дату на ближайший месяц с данными
      if (!months.find(d => d.getTime() === new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime())) {
        setCurrentDate(months[months.length - 1])
      }
    } else {
      setAvailableDates([new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)])
    }
    
    setLoading(false)
  }

  async function handleAddTransaction(data: {
    amount: number
    categoryId: string
    note: string
    date: Date
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('transactions').insert({
      user_id: user.id,
      category_id: data.categoryId,
      amount: data.amount,
      type: modalType,
      note: data.note || null,
      transaction_date: data.date.toISOString(),
    })

    loadData()
  }

  const expenseCategories = categories.filter(c => c.type === 'expense')
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const categoryTotals = expenseCategories.map(category => {
    const total = transactions
      .filter(t => t.category_id === category.id)
      .reduce((sum, t) => sum + Number(t.amount), 0)
    return {
      category,
      total,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0
    }
  }).filter(ct => ct.total > 0)

  const balance = totalIncome - totalExpenses

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p style={{ color: 'var(--text-secondary)' }}>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[480px]">
      <DateNavigator
        currentDate={currentDate}
        period={period}
        onDateChange={setCurrentDate}
        availableDates={availableDates}
      />

      <div className="relative py-8 min-h-[500px]">
        {/* Диаграмма в центре */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <DonutChart
            data={categoryTotals}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            hoveredCategory={hoveredCategory}
          />
        </div>

        {/* Категории вокруг диаграммы */}
        <div className="relative z-20">
          <CategoryGrid
            data={categoryTotals}
            onCategoryClick={(category) => {
              setModalType('expense')
              setModalOpen(true)
            }}
            onCategoryHover={setHoveredCategory}
          />
        </div>
      </div>

      <BalanceCard balance={balance} />

      <ActionButtons
        onAddExpense={() => {
          setModalType('expense')
          setModalOpen(true)
        }}
        onAddIncome={() => {
          setModalType('income')
          setModalOpen(true)
        }}
      />

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        categories={categories}
        onSubmit={handleAddTransaction}
      />
    </div>
  )
}
