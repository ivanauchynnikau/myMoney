-- Function to create default categories for new users
CREATE OR REPLACE FUNCTION create_default_categories(user_id UUID)
RETURNS void AS $$
BEGIN
  -- Default expense categories
  INSERT INTO categories (user_id, name, icon, color, type, position, is_default) VALUES
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
$$ LANGUAGE plpgsql;

-- Trigger to auto-create profile and categories on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO profiles (id, theme, initial_balance)
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
