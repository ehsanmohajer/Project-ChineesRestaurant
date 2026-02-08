-- Insert sample menu categories
INSERT INTO menu_categories (name, display_order) VALUES
('Pizzas', 1),
('Kebabs', 2),
('Burgers', 3),
('Salads', 4),
('Drinks', 5),
('Desserts', 6)
ON CONFLICT DO NOTHING;

-- Get category IDs
DO $$
DECLARE
  pizza_id UUID;
  kebab_id UUID;
  burger_id UUID;
  salad_id UUID;
  drink_id UUID;
  dessert_id UUID;
BEGIN
  SELECT id INTO pizza_id FROM menu_categories WHERE name = 'Pizzas' LIMIT 1;
  SELECT id INTO kebab_id FROM menu_categories WHERE name = 'Kebabs' LIMIT 1;
  SELECT id INTO burger_id FROM menu_categories WHERE name = 'Burgers' LIMIT 1;
  SELECT id INTO salad_id FROM menu_categories WHERE name = 'Salads' LIMIT 1;
  SELECT id INTO drink_id FROM menu_categories WHERE name = 'Drinks' LIMIT 1;
  SELECT id INTO dessert_id FROM menu_categories WHERE name = 'Desserts' LIMIT 1;

  -- Insert Pizzas
  INSERT INTO menu_items (category_id, name, description, price, is_available, is_popular) VALUES
  (pizza_id, 'Margherita', 'Classic pizza with tomato sauce, mozzarella, and basil', 9.90, true, true),
  (pizza_id, 'Pepperoni', 'Tomato sauce, mozzarella, and pepperoni', 11.90, true, true),
  (pizza_id, 'Hawaiian', 'Tomato sauce, mozzarella, ham, and pineapple', 11.50, true, false),
  (pizza_id, 'Veggie Special', 'Tomato sauce, mozzarella, bell peppers, mushrooms, onions, olives', 12.50, true, false),
  (pizza_id, 'BBQ Chicken', 'BBQ sauce, mozzarella, grilled chicken, red onions, cilantro', 13.90, true, true),
  (pizza_id, 'Four Cheese', 'Mozzarella, gorgonzola, parmesan, and goat cheese', 12.90, true, false),
  (pizza_id, 'Meat Lovers', 'Tomato sauce, mozzarella, pepperoni, ham, bacon, and sausage', 14.90, true, true);

  -- Insert Kebabs
  INSERT INTO menu_items (category_id, name, description, price, is_available, is_popular) VALUES
  (kebab_id, 'Chicken Kebab Roll', 'Grilled chicken, fresh vegetables, and garlic sauce in warm pita', 8.50, true, true),
  (kebab_id, 'Lamb Kebab Roll', 'Tender lamb kebab with vegetables and special sauce', 9.50, true, true),
  (kebab_id, 'Falafel Roll', 'Crispy falafel balls with hummus and fresh veggies', 7.90, true, false),
  (kebab_id, 'Kebab Plate', 'Your choice of meat served with rice, salad, and fries', 13.90, true, true),
  (kebab_id, 'Mixed Kebab', 'Combination of chicken and lamb kebab with sides', 14.90, true, false);

  -- Insert Burgers
  INSERT INTO menu_items (category_id, name, description, price, is_available, is_popular) VALUES
  (burger_id, 'Classic Burger', 'Beef patty, lettuce, tomato, onion, pickles, and burger sauce', 10.50, true, false),
  (burger_id, 'Cheese Burger', 'Beef patty with melted cheese and classic toppings', 11.50, true, true),
  (burger_id, 'Bacon Burger', 'Beef patty with crispy bacon, cheese, and BBQ sauce', 12.90, true, false),
  (burger_id, 'Chicken Burger', 'Crispy chicken fillet with mayo and fresh vegetables', 10.90, true, false);

  -- Insert Salads
  INSERT INTO menu_items (category_id, name, description, price, is_available, is_popular) VALUES
  (salad_id, 'Caesar Salad', 'Romaine lettuce, parmesan, croutons, and Caesar dressing', 8.90, true, false),
  (salad_id, 'Greek Salad', 'Tomatoes, cucumber, olives, feta cheese, and olive oil', 7.90, true, false),
  (salad_id, 'Garden Salad', 'Mixed greens, tomatoes, cucumber, carrots with house dressing', 6.50, true, false);

  -- Insert Drinks
  INSERT INTO menu_items (category_id, name, description, price, is_available, is_popular) VALUES
  (drink_id, 'Coca-Cola 0.33L', 'Classic Coca-Cola', 2.50, true, false),
  (drink_id, 'Sprite 0.33L', 'Refreshing lemon-lime soda', 2.50, true, false),
  (drink_id, 'Fanta 0.33L', 'Orange flavored soda', 2.50, true, false),
  (drink_id, 'Water 0.5L', 'Still water', 2.00, true, false),
  (drink_id, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 4.50, true, false);

  -- Insert Desserts
  INSERT INTO menu_items (category_id, name, description, price, is_available, is_popular) VALUES
  (dessert_id, 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 5.90, true, false),
  (dessert_id, 'Chocolate Cake', 'Rich chocolate cake with chocolate frosting', 4.90, true, true),
  (dessert_id, 'Ice Cream', 'Vanilla, chocolate, or strawberry (3 scoops)', 4.50, true, false);

END $$;

-- Insert sample daily deals
INSERT INTO daily_deals (title, description, discount_percentage, discount_amount, start_date, end_date, is_active) VALUES
('Lunch Special', 'Get any pizza + drink for special price!', 20, 3.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true),
('Family Combo', 'Two large pizzas + 4 drinks', 15, 5.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true),
('Kebab Tuesday', 'All kebab rolls 20% off every Tuesday', 20, NULL, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', true);

-- Insert sample opening hours (Monday-Sunday)
INSERT INTO opening_hours (day_of_week, open_time, close_time, is_closed) VALUES
(1, '10:00', '22:00', false),  -- Monday
(2, '10:00', '22:00', false),  -- Tuesday
(3, '10:00', '22:00', false),  -- Wednesday
(4, '10:00', '22:00', false),  -- Thursday
(5, '10:00', '23:00', false),  -- Friday
(6, '11:00', '23:00', false),  -- Saturday
(0, '12:00', '21:00', false)   -- Sunday
ON CONFLICT (day_of_week) DO UPDATE SET
  open_time = EXCLUDED.open_time,
  close_time = EXCLUDED.close_time,
  is_closed = EXCLUDED.is_closed;

-- Insert business settings
INSERT INTO business_settings (
  name,
  tagline,
  description,
  address,
  phone,
  email,
  google_rating,
  google_reviews_url
) VALUES (
  'Saaren Pizza & Kebab',
  'Local taste in Viitasaari',
  'Delicious pizzas and kebabs in the heart of Viitasaari. Known for generous toppings and crispy kebab rolls!',
  'Keskuskatu 10, 44500 Viitasaari',
  '+358 40 123 4567',
  'info@saarenpizza.fi',
  4.5,
  'https://www.google.com/maps'
)
ON CONFLICT DO NOTHING;
