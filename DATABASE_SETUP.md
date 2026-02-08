# Local Eats Hub - Database Setup

## Applying the Sample Data Migration

The project includes a migration file with sample menu data at:
`supabase/migrations/20260208000000_add_sample_data.sql`

### To apply this migration to your Supabase database:

1. **Using Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy the contents of `supabase/migrations/20260208000000_add_sample_data.sql`
   - Paste and run the SQL

2. **Using Supabase CLI:**
   ```bash
   # Make sure you have Supabase CLI installed
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Link your project
   supabase link --project-ref your-project-ref

   # Apply migrations
   supabase db push
   ```

### What the Migration Includes:

- **7 Pizza items** (Margherita, Pepperoni, Hawaiian, Veggie Special, BBQ Chicken, Four Cheese, Meat Lovers)
- **5 Kebab items** (Chicken Kebab Roll, Lamb Kebab Roll, Falafel Roll, Kebab Plate, Mixed Kebab)
- **4 Burger items** (Classic, Cheese, Bacon, Chicken)
- **3 Salad items** (Caesar, Greek, Garden)
- **5 Drink items** (Soft drinks, Water, Juice)
- **3 Dessert items** (Tiramisu, Chocolate Cake, Ice Cream)
- **3 Daily deals** (Lunch Special, Family Combo, Kebab Tuesday)
- **Opening hours** (Monday-Sunday)
- **Business settings** (Restaurant name, address, phone, etc.)

All items are marked as available and some popular items are highlighted.
