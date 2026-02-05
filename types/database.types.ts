export type Profile = {
  id: string
  theme: 'light' | 'dark'
  initial_balance: number
  created_at: string
}

export type Category = {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  type: 'expense' | 'income'
  position: number
  is_default: boolean
  created_at: string
}

export type Transaction = {
  id: string
  user_id: string
  category_id: string
  amount: number
  type: 'expense' | 'income'
  note: string | null
  transaction_date: string
  created_at: string
}
