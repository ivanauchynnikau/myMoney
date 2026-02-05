import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'

export type PeriodType = 'day' | 'month' | 'year'

export function getPeriodRange(date: Date, period: PeriodType): { start: Date; end: Date } {
  switch (period) {
    case 'day':
      return { start: startOfDay(date), end: endOfDay(date) }
    case 'month':
      return { start: startOfMonth(date), end: endOfMonth(date) }
    case 'year':
      return { start: startOfYear(date), end: endOfYear(date) }
  }
}

export function formatPeriod(date: Date, period: PeriodType): string {
  const monthNames = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
  
  switch (period) {
    case 'day':
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    case 'month':
      return monthNames[date.getMonth()]
    case 'year':
      return date.getFullYear().toString()
  }
}
