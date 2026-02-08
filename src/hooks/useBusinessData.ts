import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSettings, OpeningHours, MenuCategory, MenuItem, DailyDeal, GoogleReview } from '@/types/database';

export function useBusinessSettings() {
  return useQuery({
    queryKey: ['business-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .single();
      if (error) throw error;
      return data as BusinessSettings;
    }
  });
}

export function useOpeningHours() {
  return useQuery({
    queryKey: ['opening-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opening_hours')
        .select('*')
        .order('day_of_week');
      if (error) throw error;
      return data as OpeningHours[];
    }
  });
}

export function useMenuCategories() {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data as MenuCategory[];
    }
  });
}

export function useMenuItems() {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('display_order');
      if (error) throw error;
      return data as MenuItem[];
    }
  });
}

export function useDailyDeals() {
  return useQuery({
    queryKey: ['daily-deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_deals')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data as DailyDeal[];
    }
  });
}

export function useGoogleReviews() {
  return useQuery({
    queryKey: ['google-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('google_reviews')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as GoogleReview[];
    }
  });
}

export function useIsOpen() {
  const { data: hours } = useOpeningHours();
  
  if (!hours) return { isOpen: false, todayHours: null };
  
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayHours = hours.find(h => h.day_of_week === dayOfWeek);
  
  if (!todayHours || todayHours.is_closed) {
    return { isOpen: false, todayHours };
  }
  
  const isOpen = todayHours.open_time && todayHours.close_time &&
    currentTime >= todayHours.open_time && currentTime <= todayHours.close_time;
  
  return { isOpen, todayHours };
}
