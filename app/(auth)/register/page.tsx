'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '../actions'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg" style={{ background: 'var(--card)' }}>
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--text)' }}>
          Регистрация
        </h1>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ 
                background: 'var(--bg)', 
                color: 'var(--text)',
                borderColor: 'var(--border)'
              }}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ 
                background: 'var(--bg)', 
                color: 'var(--text)',
                borderColor: 'var(--border)'
              }}
              placeholder="••••••"
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Минимум 6 символов
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--income)', color: 'white' }}
          >
            {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Уже есть аккаунт?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--income)' }}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
