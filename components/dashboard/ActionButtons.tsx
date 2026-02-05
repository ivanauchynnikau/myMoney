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
        className="flex items-center justify-center gap-3 py-4 rounded-full font-semibold text-white transition-transform active:scale-95"
        style={{ backgroundColor: 'var(--expense)' }}
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Minus size={24} />
        </div>
        <span>РАСХОД</span>
      </button>

      <button
        onClick={onAddIncome}
        className="flex items-center justify-center gap-3 py-4 rounded-full font-semibold text-white transition-transform active:scale-95"
        style={{ backgroundColor: 'var(--income)' }}
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Plus size={24} />
        </div>
        <span>ДОХОД</span>
      </button>
    </div>
  )
}
