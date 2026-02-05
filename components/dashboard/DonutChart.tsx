'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils/currency'
import type { Category } from '@/types/database.types'

interface CategoryTotal {
  category: Category
  total: number
  percentage: number
}

interface DonutChartProps {
  data: CategoryTotal[]
  totalIncome: number
  totalExpenses: number
  hoveredCategory: string | null
}

export default function DonutChart({
  data,
  totalIncome,
  totalExpenses,
  hoveredCategory,
}: DonutChartProps) {
  const chartData = data.map((item) => ({
    name: item.category.name,
    value: item.total,
    color: item.category.color,
  }))

  const hoveredItem = data.find((item) => item.category.id === hoveredCategory)

  // Если нет данных, показываем пустую диаграмму
  const displayData = chartData.length > 0 ? chartData : [{ name: 'Empty', value: 1, color: '#E0E0E0' }]

  return (
    <div className="relative w-[250px] h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="85%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {hoveredItem ? (
          <>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {hoveredItem.category.name}
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              {formatCurrency(hoveredItem.total)}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {hoveredItem.percentage.toFixed(0)}%
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold" style={{ color: 'var(--income)' }}>
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--expense)' }}>
              {formatCurrency(totalExpenses)}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
