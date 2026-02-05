# Monefy Pro Clone

Web клон приложения Monefy Pro для управления личными финансами.

## Функции MVP

- ✅ Авторизация (Email/Password)
- ✅ Главный экран с кольцевой диаграммой расходов
- ✅ Добавление расходов и доходов
- ✅ Фильтрация по периодам (День/Месяц/Год)
- ✅ Управление категориями
- ✅ Светлая и темная тема
- ✅ Адаптивный дизайн (Mobile-first)

## Стек

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + Database)
- Recharts
- Lucide Icons

## Установка

```bash
npm install
```

## Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Выполните SQL из `supabase/schema.sql` и `supabase/seed.sql`
3. Создайте `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Деплой на GitHub Pages

1. Добавьте Supabase переменные в GitHub Secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Push в main/master триггерит автодеплой

## Структура

```
app/
  (auth)/           # Страницы авторизации
  (dashboard)/      # Защищенные страницы
components/
  dashboard/        # Компоненты главного экрана
  transaction/      # Модальное окно добавления
  layout/           # Header и навигация
lib/
  supabase/         # Клиенты Supabase
  utils/            # Утилиты (дата, валюта)
types/              # TypeScript типы
supabase/           # SQL схема и seed
```

## Цветовая палитра

**Светлая тема:**
- Background: #F5F5F5
- Card: #FFFFFF
- Expense: #E57373
- Income: #81C784

**Темная тема:**
- Background: #1C262B
- Card: #263238
- Expense: #EF5350
- Income: #66BB6A
