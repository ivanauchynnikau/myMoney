'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types/database.types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('type', { ascending: false })
      .order('position')

    if (data) setCategories(data)
    setLoading(false)
  }

  async function deleteCategory(id: string) {
    if (!confirm('Удалить категорию?')) return
    
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    loadCategories()
  }

  const expenseCategories = categories.filter(c => c.type === 'expense')
  const incomeCategories = categories.filter(c => c.type === 'income')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p style={{ color: 'var(--text-secondary)' }}>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[480px] p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Категории
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: 'var(--income)' }}
        >
          <Plus size={18} />
          Добавить
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--expense)' }}>
            Расходы
          </h2>
          <div className="space-y-2">
            {expenseCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: category.color + '20' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <span className="font-medium" style={{ color: 'var(--text)' }}>
                    {category.name}
                  </span>
                  {category.is_default && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700" style={{ color: 'var(--text-secondary)' }}>
                      По умолчанию
                    </span>
                  )}
                </div>

                {!category.is_default && (
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                      style={{ color: 'var(--expense)' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--income)' }}>
            Доходы
          </h2>
          <div className="space-y-2">
            {incomeCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: category.color + '20' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <span className="font-medium" style={{ color: 'var(--text)' }}>
                    {category.name}
                  </span>
                  {category.is_default && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700" style={{ color: 'var(--text-secondary)' }}>
                      По умолчанию
                    </span>
                  )}
                </div>

                {!category.is_default && (
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                      style={{ color: 'var(--expense)' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
