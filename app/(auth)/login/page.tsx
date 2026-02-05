'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '../actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const result = await login(email, password)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg" style={{ background: 'var(--card)' }}>
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--text)' }}>
          Monefy
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Нет аккаунта?{' '}
          <Link href="/register" className="font-semibold" style={{ color: 'var(--income)' }}>
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
