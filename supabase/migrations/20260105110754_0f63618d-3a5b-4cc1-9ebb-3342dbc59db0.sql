-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

-- Create menu categories table
CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create business settings table
CREATE TABLE public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Saaren Pizza & Kebab',
  phone TEXT DEFAULT '+358 45 2157766',
  email TEXT DEFAULT 'saarenpizza@gmail.com',
  address TEXT DEFAULT 'Keskitie 1, 44500 Viitasaari, Finland',
  tagline TEXT DEFAULT 'Paikallinen maku Viitasaarella. Tervetuloa!',
  description TEXT,
  google_reviews_url TEXT,
  google_rating DECIMAL(2,1) DEFAULT 4.5,
  google_review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create opening hours table
CREATE TABLE public.opening_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(day_of_week)
);

-- Create daily deals table
CREATE TABLE public.daily_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  discount_percentage INTEGER,
  discount_amount DECIMAL(10,2),
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  pickup_time TIMESTAMPTZ,
  special_instructions TEXT,
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create google reviews cache table
CREATE TABLE public.google_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  time_description TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Public read policies for menu, settings, hours, deals, reviews
CREATE POLICY "Anyone can view menu categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Anyone can view business settings" ON public.business_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can view opening hours" ON public.opening_hours FOR SELECT USING (true);
CREATE POLICY "Anyone can view active daily deals" ON public.daily_deals FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view visible reviews" ON public.google_reviews FOR SELECT USING (is_visible = true);

-- Admin policies for menu categories
CREATE POLICY "Admins can insert menu categories" ON public.menu_categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update menu categories" ON public.menu_categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete menu categories" ON public.menu_categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for menu items
CREATE POLICY "Admins can insert menu items" ON public.menu_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update menu items" ON public.menu_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete menu items" ON public.menu_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for business settings
CREATE POLICY "Admins can insert business settings" ON public.business_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update business settings" ON public.business_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for opening hours
CREATE POLICY "Admins can insert opening hours" ON public.opening_hours FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update opening hours" ON public.opening_hours FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for daily deals
CREATE POLICY "Admins can view all deals" ON public.daily_deals FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert daily deals" ON public.daily_deals FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update daily deals" ON public.daily_deals FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete daily deals" ON public.daily_deals FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for google reviews
CREATE POLICY "Admins can view all reviews" ON public.google_reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert reviews" ON public.google_reviews FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update reviews" ON public.google_reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reviews" ON public.google_reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Order policies - anyone can create orders
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Admins can view and manage all orders
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Insert default business settings
INSERT INTO public.business_settings (name, phone, email, address, tagline, description)
VALUES (
  'Saaren Pizza & Kebab',
  '+358 45 2157766',
  'saarenpizza@gmail.com',
  'Keskitie 1, 44500 Viitasaari, Finland',
  'Paikallinen maku Viitasaarella. Tervetuloa!',
  'Saaren Pizza & Kebab tarjoaa laajan valikoiman herkullisia pizzoja ja kebabeja Viitasaaren ydinkeskustassa. Tunnettu reiluista täytteistä, rapeista kebabrullista ja maukkaista falafeleista.'
);

-- Insert default opening hours (Monday=1 to Sunday=0)
INSERT INTO public.opening_hours (day_of_week, open_time, close_time, is_closed) VALUES
(1, '10:00', '21:00', false),
(2, '10:00', '21:00', false),
(3, '10:00', '21:00', false),
(4, '10:00', '21:00', false),
(5, '10:00', '22:00', false),
(6, '11:00', '22:00', false),
(0, '12:00', '20:00', false);

-- Insert default menu categories
INSERT INTO public.menu_categories (name, name_en, display_order) VALUES
('Pizzat', 'Pizzas', 1),
('Kebabit', 'Kebabs', 2),
('Falafel & Kasvis', 'Falafel & Vegetarian', 3),
('Juomat', 'Drinks', 4);

-- Insert sample menu items
INSERT INTO public.menu_items (category_id, name, name_en, description, price, is_popular, display_order) VALUES
((SELECT id FROM public.menu_categories WHERE name = 'Pizzat'), 'Margherita', 'Margherita', 'Tomaattikastike, mozzarella, basilika', 9.50, false, 1),
((SELECT id FROM public.menu_categories WHERE name = 'Pizzat'), 'Pepperoni', 'Pepperoni', 'Tomaattikastike, mozzarella, pepperoni', 11.50, true, 2),
((SELECT id FROM public.menu_categories WHERE name = 'Pizzat'), 'Quattro Formaggi', 'Four Cheese', 'Neljän juuston pizza', 12.50, false, 3),
((SELECT id FROM public.menu_categories WHERE name = 'Pizzat'), 'Kebab Pizza', 'Kebab Pizza', 'Tomaattikastike, mozzarella, kebabliha, sipuli', 13.00, true, 4),
((SELECT id FROM public.menu_categories WHERE name = 'Kebabit'), 'Kebab Rulla', 'Kebab Roll', 'Rapea rulla, kebabliha, salaatti, kastike', 8.50, true, 1),
((SELECT id FROM public.menu_categories WHERE name = 'Kebabit'), 'Kebab Lautanen', 'Kebab Plate', 'Kebabliha, riisi, salaatti, kastike', 12.00, false, 2),
((SELECT id FROM public.menu_categories WHERE name = 'Kebabit'), 'Iskender Kebab', 'Iskender Kebab', 'Kebabliha, leipä, tomaattikastike, jogurtti', 14.00, false, 3),
((SELECT id FROM public.menu_categories WHERE name = 'Falafel & Kasvis'), 'Falafel Rulla', 'Falafel Wrap', 'Rapeat falafel-pallot, salaatti, hummus', 8.00, true, 1),
((SELECT id FROM public.menu_categories WHERE name = 'Falafel & Kasvis'), 'Falafel Lautanen', 'Falafel Plate', 'Falafel, riisi, salaatti, hummus', 11.00, false, 2),
((SELECT id FROM public.menu_categories WHERE name = 'Juomat'), 'Coca-Cola 0.5L', 'Coca-Cola 0.5L', NULL, 3.00, false, 1),
((SELECT id FROM public.menu_categories WHERE name = 'Juomat'), 'Fanta 0.5L', 'Fanta 0.5L', NULL, 3.00, false, 2),
((SELECT id FROM public.menu_categories WHERE name = 'Juomat'), 'Sprite 0.5L', 'Sprite 0.5L', NULL, 3.00, false, 3);

-- Insert sample reviews
INSERT INTO public.google_reviews (author_name, rating, text, time_description) VALUES
('Mikko K.', 5, 'Paras kebab Viitasaarella! Aina tuoretta ja maukasta.', '2 viikkoa sitten'),
('Laura S.', 5, 'Herkullinen pepperoni pizza, iso annos ja hyvä hinta.', '1 kuukausi sitten'),
('Antti M.', 4, 'Nopea palvelu ja hyvä ruoka. Suosittelen!', '3 viikkoa sitten'),
('Sofia L.', 5, 'Falafel on parasta! Kasvisvaihtoehdot ovat erinomaisia.', '1 viikko sitten');