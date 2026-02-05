# Настройка Supabase для Monefy Clone

## 📋 Шаг 1: Очистка (если уже создавали таблицы)

Выполните в **Supabase → SQL Editor**:

```sql
-- Удаляем все старые объекты
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS create_default_categories(UUID);
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

---

## 🗄️ Шаг 2: Создание таблиц (schema.sql)

Выполните в **Supabase → SQL Editor**:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  initial_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Note: No INSERT policy - profiles are created only by trigger with SECURITY DEFINER

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  position INTEGER NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Users can view own categories" 
  ON categories FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" 
  ON categories FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own non-default categories" 
  ON categories FOR UPDATE 
  USING (auth.uid() = user_id AND is_default = false);

CREATE POLICY "Users can delete own non-default categories" 
  ON categories FOR DELETE 
  USING (auth.uid() = user_id AND is_default = false);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  note TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Users can view own transactions" 
  ON transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
  ON transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" 
  ON transactions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" 
  ON transactions FOR DELETE 
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_categories_user_id ON categories(user_id);
```

**Ожидаемый результат:** `Success. No rows returned`

---

## 🔧 Шаг 3: Создание функций и триггера (seed.sql)

Выполните в **Supabase → SQL Editor**:

```sql
-- Function to create default categories for new users
CREATE OR REPLACE FUNCTION create_default_categories(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Default expense categories
  INSERT INTO public.categories (user_id, name, icon, color, type, position, is_default) VALUES
    (user_id, 'Транспорт', '🚊', '#FFB74D', 'expense', 1, true),
    (user_id, 'Еда', '🍽️', '#FF8A80', 'expense', 2, true),
    (user_id, 'Дом', '🏠', '#64B5F6', 'expense', 3, true),
    (user_id, 'Покупки', '🛒', '#F48FB1', 'expense', 4, true),
    (user_id, 'Развлечения', '🍹', '#FFD54F', 'expense', 5, true),
    (user_id, 'Здоровье', '💉', '#81C784', 'expense', 6, true),
    (user_id, 'Машина', '🚗', '#90A4AE', 'expense', 7, true),
    (user_id, 'Одежда', '👕', '#CE93D8', 'expense', 8, true),
    (user_id, 'Связь', '📞', '#FFF176', 'expense', 9, true),
    (user_id, 'Красота', '💄', '#FFAB91', 'expense', 10, true),
    -- Default income categories
    (user_id, 'Зарплата', '💰', '#66BB6A', 'income', 11, true),
    (user_id, 'Подработка', '💵', '#81C784', 'income', 12, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile and categories on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, theme, initial_balance)
  VALUES (NEW.id, 'light', 0);
  
  -- Create default categories
  PERFORM create_default_categories(NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

**Ожидаемый результат:** `Success. No rows returned`

---

## ✅ Шаг 4: Проверка настройки

### 4.1 Проверка таблиц

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Должно вернуть:**
- `categories`
- `profiles`
- `transactions`

### 4.2 Проверка функций

```sql
SELECT 
  routine_name, 
  security_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'create_default_categories');
```

**Должно вернуть:**
- `create_default_categories` - **DEFINER**
- `handle_new_user` - **DEFINER**

### 4.3 Проверка триггера

```sql
SELECT 
  trigger_name, 
  event_manipulation,
  event_object_table,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

**Должно вернуть:**
- `trigger_name`: `on_auth_user_created`
- `event_manipulation`: `INSERT`
- `event_object_table`: `users`
- `action_timing`: `AFTER`

### 4.4 Проверка политик

```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

**Должно вернуть 2 политики:**
- `Users can view own profile` (SELECT)
- `Users can update own profile` (UPDATE)

**НЕ должно быть политики INSERT** (профили создаются только триггером)

---

## 🔐 Шаг 5: Настройка Email Auth

1. Перейдите в **Authentication → Providers**
2. Найдите **Email**
3. Убедитесь что включено:
   - ✅ **Enable Email provider**
4. Для разработки можете отключить:
   - ⬜ **Confirm email** (чтобы не подтверждать email)
5. Нажмите **Save**

---

## 🧪 Шаг 6: Тестирование

### 6.1 Удалите старые тестовые аккаунты

1. Перейдите в **Authentication → Users**
2. Удалите всех пользователей (если есть)

### 6.2 Регистрация

1. Запустите приложение: `npm run dev`
2. Откройте http://localhost:3000
3. Зарегистрируйтесь с новым email

### 6.3 Проверка данных

После успешной регистрации выполните:

```sql
-- Проверяем профиль
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1;

-- Проверяем категории (должно быть 12)
SELECT COUNT(*) as total, type 
FROM categories 
GROUP BY type;
```

**Ожидаемый результат:**
- **10** категорий типа `expense`
- **2** категории типа `income`

---

## 🐛 Решение проблем

### Ошибка: "relation profiles does not exist"
→ Вы не выполнили Шаг 2 (schema.sql)

### Ошибка: "Database error saving new user"
→ Проверьте логи в **Logs → Postgres Logs**

### Ошибка: "permission denied for table profiles"
→ Функции не имеют SECURITY DEFINER - выполните Шаг 3 заново

### Триггер не срабатывает
→ Проверьте наличие триггера в Шаге 4.3

---

## 🎉 Готово!

После успешной настройки:
- ✅ При регистрации автоматически создается профиль
- ✅ Автоматически создается 12 категорий
- ✅ Данные защищены Row Level Security
- ✅ Каждый пользователь видит только свои данные
