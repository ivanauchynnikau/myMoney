'use client'

import { LogOut } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

interface HeaderProps {
  userEmail: string
}

export default function Header({ userEmail }: HeaderProps) {
  return (
    <header className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
      <div className="mx-auto max-w-[480px] px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: 'var(--income)' }}>
          Monefy
        </h1>
        
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          title={userEmail}
        >
          <LogOut size={18} />
          <span className="text-sm">Выход</span>
        </button>
      </div>
    </header>
  )
}
