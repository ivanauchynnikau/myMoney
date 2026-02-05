'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPeriod, type PeriodType } from '@/lib/utils/date'

interface DateNavigatorProps {
  currentDate: Date
  period: PeriodType
  onDateChange: (date: Date) => void
  availableDates: Date[]
}

export default function DateNavigator({
  currentDate,
  period,
  onDateChange,
  availableDates,
}: DateNavigatorProps) {
  const currentIndex = availableDates.findIndex(
    date => date.getTime() === currentDate.getTime()
  )

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < availableDates.length - 1

  const navigateDate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && canGoPrev) {
      onDateChange(availableDates[currentIndex - 1])
    } else if (direction === 'next' && canGoNext) {
      onDateChange(availableDates[currentIndex + 1])
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <button
        onClick={() => navigateDate('prev')}
        disabled={!canGoPrev}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: 'var(--text)' }}
      >
        <ChevronLeft size={24} />
      </button>

      <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
        {formatPeriod(currentDate, period)}
      </h2>

      <button
        onClick={() => navigateDate('next')}
        disabled={!canGoNext}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: 'var(--text)' }}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}
