'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import SimpleNumPad from './SimpleNumPad'
import CategorySelector from './CategorySelector'
import type { Category } from '@/types/database.types'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'expense' | 'income'
  categories: Category[]
  onSubmit: (data: {
    amount: number
    categoryId: string
    note: string
    date: Date
  }) => void
}

export default function TransactionModal({
  isOpen,
  onClose,
  type,
  categories,
  onSubmit,
}: TransactionModalProps) {
  const [step, setStep] = useState<'amount' | 'category' | 'details'>('amount')
  const [amount, setAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  if (!isOpen) return null

  const handleAmountConfirm = () => {
    if (parseFloat(amount) > 0) {
      setStep('category')
    }
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setStep('details')
  }

  const handleSubmit = () => {
    if (selectedCategory && parseFloat(amount) > 0) {
      onSubmit({
        amount: parseFloat(amount),
        categoryId: selectedCategory.id,
        note,
        date: new Date(date),
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setStep('amount')
    setAmount('')
    setSelectedCategory(null)
    setNote('')
    setDate(new Date().toISOString().split('T')[0])
    onClose()
  }

  const filteredCategories = categories.filter((cat) => cat.type === type)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      
      <div
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--card)' }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
            {type === 'expense' ? 'Новый расход' : 'Новый доход'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: 'var(--text)' }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {step === 'amount' && (
            <div>
              <div className="mb-6">
                <p className="text-4xl font-bold text-center mb-2" style={{ color: 'var(--text)' }}>
                  {amount || '0'} ₽
                </p>
              </div>
              <SimpleNumPad value={amount} onChange={setAmount} />
              <button
                onClick={handleAmountConfirm}
                disabled={!amount || parseFloat(amount) === 0}
                className="w-full mt-4 py-3 rounded-lg font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: type === 'expense' ? 'var(--expense)' : 'var(--income)' }}
              >
                Далее
              </button>
            </div>
          )}

          {step === 'category' && (
            <div>
              <CategorySelector
                categories={filteredCategories}
                onSelect={handleCategorySelect}
              />
            </div>
          )}

          {step === 'details' && selectedCategory && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 p-4 rounded-lg" style={{ backgroundColor: selectedCategory.color + '20' }}>
                <span className="text-3xl">{selectedCategory.icon}</span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>{selectedCategory.name}</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{amount} ₽</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Заметка (необязательно)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ 
                    background: 'var(--bg)', 
                    color: 'var(--text)',
                    borderColor: 'var(--border)'
                  }}
                  placeholder="Добавить заметку..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Дата
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                  style={{ 
                    background: 'var(--bg)', 
                    color: 'var(--text)',
                    borderColor: 'var(--border)'
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-lg font-semibold text-white"
                style={{ backgroundColor: type === 'expense' ? 'var(--expense)' : 'var(--income)' }}
              >
                Сохранить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
