'use client'

import { LogOut, Moon, Sun, Settings } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/providers/ThemeProvider'
import { logout } from '@/app/(auth)/actions'

interface HeaderProps {
  userEmail: string
}

export default function Header({ userEmail }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
      <div className="mx-auto max-w-[480px] px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard">
          <h1 className="text-xl font-bold" style={{ color: 'var(--income)' }}>
            Monefy
          </h1>
        </Link>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Переключить тему"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            href="/categories"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Категории"
          >
            <Settings size={18} />
          </Link>

          <button
            onClick={() => logout()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title={userEmail}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
