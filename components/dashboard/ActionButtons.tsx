'use client'

import { Minus, Plus } from 'lucide-react'

interface ActionButtonsProps {
  onAddExpense: () => void
  onAddIncome: () => void
}

export default function ActionButtons({ onAddExpense, onAddIncome }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 py-6">
      <button
        onClick={onAddExpense}
        className="flex items-center justify-center py-4 rounded-full font-semibold text-white transition-transform active:scale-95"
        style={{ backgroundColor: 'var(--expense)' }}
      >
        <Minus size={32} />
      </button>

      <button
        onClick={onAddIncome}
        className="flex items-center justify-center py-4 rounded-full font-semibold text-white transition-transform active:scale-95"
        style={{ backgroundColor: 'var(--income)' }}
      >
        <Plus size={32} />
      </button>
    </div>
  )
}
