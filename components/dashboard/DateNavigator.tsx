'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPeriod, type PeriodType } from '@/lib/utils/date'

interface DateNavigatorProps {
  currentDate: Date
  period: PeriodType
  onDateChange: (date: Date) => void
  onPeriodChange: (period: PeriodType) => void
}

export default function DateNavigator({
  currentDate,
  period,
  onDateChange,
  onPeriodChange,
}: DateNavigatorProps) {
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    
    if (period === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    } else if (period === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1))
    }
    
    onDateChange(newDate)
  }

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <button
        onClick={() => navigateDate('prev')}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        style={{ color: 'var(--text)' }}
      >
        <ChevronLeft size={24} />
      </button>

      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
          {formatPeriod(currentDate, period)}
        </h2>
        <div className="flex gap-2 mt-2">
          {(['day', 'month', 'year'] as PeriodType[]).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className="px-3 py-1 text-sm rounded-full transition-colors"
              style={{
                background: period === p ? 'var(--income)' : 'transparent',
                color: period === p ? 'white' : 'var(--text-secondary)',
              }}
            >
              {p === 'day' ? 'День' : p === 'month' ? 'Месяц' : 'Год'}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigateDate('next')}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        style={{ color: 'var(--text)' }}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}
