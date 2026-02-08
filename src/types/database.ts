export interface MenuCategory {
  id: string;
  name: string;
  name_en: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  tagline: string | null;
  description: string | null;
  google_reviews_url: string | null;
  google_rating: number | null;
  google_review_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface OpeningHours {
  id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  created_at: string;
}

export interface DailyDeal {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  discount_percentage: number | null;
  discount_amount: number | null;
  menu_item_id: string | null;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  pickup_time: string | null;
  special_instructions: string | null;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  special_requests: string | null;
  created_at: string;
}

export interface GoogleReview {
  id: string;
  author_name: string;
  rating: number;
  text: string | null;
  time_description: string | null;
  is_visible: boolean;
  created_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialRequests?: string;
}
