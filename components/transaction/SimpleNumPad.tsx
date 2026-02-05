'use client'

import { Delete } from 'lucide-react'

interface SimpleNumPadProps {
  value: string
  onChange: (value: string) => void
}

export default function SimpleNumPad({ value, onChange }: SimpleNumPadProps) {
  const handleDigit = (digit: string) => {
    if (digit === '.' && value.includes('.')) return
    if (value === '0' && digit !== '.') {
      onChange(digit)
    } else {
      onChange(value + digit)
    }
  }

  const handleDelete = () => {
    onChange(value.slice(0, -1))
  }

  const handleClear = () => {
    onChange('')
  }

  const buttons = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['.', '0', 'del'],
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {buttons.map((row, i) =>
        row.map((btn) => (
          <button
            key={`${i}-${btn}`}
            onClick={() => {
              if (btn === 'del') handleDelete()
              else handleDigit(btn)
            }}
            className="aspect-square flex items-center justify-center text-2xl font-semibold rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: 'var(--text)' }}
          >
            {btn === 'del' ? <Delete size={24} /> : btn}
          </button>
        ))
      )}
    </div>
  )
}
