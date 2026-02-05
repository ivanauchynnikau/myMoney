'use client'

import type { Category } from '@/types/database.types'

interface CategoryTotal {
  category: Category
  total: number
  percentage: number
}

interface CategoryGridProps {
  data: CategoryTotal[]
  onCategoryClick: (category: Category) => void
  onCategoryHover: (categoryId: string | null) => void
}

export default function CategoryGrid({
  data,
  onCategoryClick,
  onCategoryHover,
}: CategoryGridProps) {
  // Arrange categories in a circle around the chart
  const positions = [
    'top-0 left-1/2 -translate-x-1/2',
    'top-8 right-8',
    'top-1/2 right-0 -translate-y-1/2',
    'bottom-8 right-8',
    'bottom-0 left-1/2 -translate-x-1/2',
    'bottom-8 left-8',
    'top-1/2 left-0 -translate-y-1/2',
    'top-8 left-8',
  ]

  return (
    <div className="relative aspect-square max-w-[480px] mx-auto px-4 py-8">
      {data.slice(0, 8).map((item, index) => (
        <button
          key={item.category.id}
          onClick={() => onCategoryClick(item.category)}
          onMouseEnter={() => onCategoryHover(item.category.id)}
          onMouseLeave={() => onCategoryHover(null)}
          className={`absolute ${positions[index]} flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95`}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg"
            style={{ backgroundColor: item.category.color }}
          >
            {item.category.icon}
          </div>
          {item.total > 0 && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: item.category.color + '20',
                color: item.category.color
              }}
            >
              {item.percentage.toFixed(0)}%
            </span>
          )}
        </button>
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Placeholder for DonutChart */}
        <div className="w-[300px] h-[300px]" />
      </div>
    </div>
  )
}
