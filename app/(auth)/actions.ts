'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function ensureUserProfile(userId: string) {
  const supabase = await createClient()
  
  // Проверяем существование профиля
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()

  if (!profile) {
    // Создаем профиль
    await supabase.from('profiles').insert({
      id: userId,
      theme: 'light',
      period: 'month',
      initial_balance: 0,
    })

    // Создаем дефолтные категории
    const defaultCategories = [
      { name: 'Транспорт', icon: '🚊', color: '#FFB74D', type: 'expense', position: 1 },
      { name: 'Еда', icon: '🍽️', color: '#FF8A80', type: 'expense', position: 2 },
      { name: 'Дом', icon: '🏠', color: '#64B5F6', type: 'expense', position: 3 },
      { name: 'Покупки', icon: '🛒', color: '#F48FB1', type: 'expense', position: 4 },
      { name: 'Развлечения', icon: '🍹', color: '#FFD54F', type: 'expense', position: 5 },
      { name: 'Здоровье', icon: '💉', color: '#81C784', type: 'expense', position: 6 },
      { name: 'Машина', icon: '🚗', color: '#90A4AE', type: 'expense', position: 7 },
      { name: 'Одежда', icon: '👕', color: '#CE93D8', type: 'expense', position: 8 },
      { name: 'Связь', icon: '📞', color: '#FFF176', type: 'expense', position: 9 },
      { name: 'Красота', icon: '💄', color: '#FFAB91', type: 'expense', position: 10 },
      { name: 'Зарплата', icon: '💰', color: '#66BB6A', type: 'income', position: 11 },
      { name: 'Подработка', icon: '💵', color: '#81C784', type: 'income', position: 12 },
    ]

    await supabase.from('categories').insert(
      defaultCategories.map(cat => ({
        ...cat,
        user_id: userId,
        is_default: true,
      }))
    )
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  if (authData.user) {
    await ensureUserProfile(authData.user.id)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  if (authData.user) {
    await ensureUserProfile(authData.user.id)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
