import type { Category } from '@/types/database.types'

interface CategorySelectorProps {
  categories: Category[]
  onSelect: (category: Category) => void
}

export default function CategorySelector({ categories, onSelect }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category)}
          className="flex flex-col items-center gap-2 p-4 rounded-lg transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: category.color + '20' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: category.color }}
          >
            {category.icon}
          </div>
          <span className="text-sm font-medium text-center" style={{ color: 'var(--text)' }}>
            {category.name}
          </span>
        </button>
      ))}
    </div>
  )
}
