import { formatCurrency } from '@/lib/utils/currency'

interface BalanceCardProps {
  balance: number
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="px-4 py-6 border-y" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
      <div className="text-center">
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
          Баланс
        </p>
        <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  )
}
