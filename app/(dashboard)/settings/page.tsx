'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/providers/ThemeProvider'
import type { PeriodType } from '@/lib/utils/date'

export default function SettingsPage() {
  const [period, setPeriod] = useState<PeriodType>('month')
  const [loading, setLoading] = useState(true)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('period')
      .eq('id', user.id)
      .single()

    if (profile?.period) {
      setPeriod(profile.period as PeriodType)
    }
    setLoading(false)
  }

  async function updatePeriod(newPeriod: PeriodType) {
    setPeriod(newPeriod)
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({ period: newPeriod })
      .eq('id', user.id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p style={{ color: 'var(--text-secondary)' }}>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[480px] p-4">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
        Настройки
      </h1>

      <div className="space-y-6">
        {/* Тема */}
        <section className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
            Внешний вид
          </h2>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Тема оформления</span>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ 
                backgroundColor: 'var(--income)',
                color: 'white'
              }}
            >
              {theme === 'dark' ? 'Светлая' : 'Темная'}
            </button>
          </div>
        </section>

        {/* Период */}
        <section className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
            Период отображения
          </h2>
          <div className="space-y-2">
            {(['day', 'month', 'year'] as PeriodType[]).map((p) => (
              <button
                key={p}
                onClick={() => updatePeriod(p)}
                className="w-full text-left px-4 py-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: period === p ? 'var(--income)' + '20' : 'transparent',
                  color: period === p ? 'var(--income)' : 'var(--text)',
                  border: period === p ? '2px solid var(--income)' : '2px solid var(--border)',
                }}
              >
                <span className="font-medium">
                  {p === 'day' ? 'День' : p === 'month' ? 'Месяц' : 'Год'}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Период по умолчанию для отображения транзакций
          </p>
        </section>
      </div>
    </div>
  )
}
