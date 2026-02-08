import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star, Flame } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

const featuredItems = [
  {
    id: 1,
    name: 'Classic Margherita',
    description: 'Fresh mozzarella, basil, and tomato sauce on our signature crust',
    price: 12.99,
    emoji: '🍕',
    isPopular: true,
    rating: 4.9,
    reviews: 124,
  },
  {
    id: 2,
    name: 'Spicy Dragon Bowl',
    description: 'Loaded with jalapeños, ghost pepper sauce, and crispy toppings',
    price: 14.99,
    emoji: '🌶️',
    isHot: true,
    rating: 4.8,
    reviews: 98,
  },
  {
    id: 3,
    name: 'Mediterranean Wrap',
    description: 'Grilled vegetables, feta cheese, and tahini sauce in a whole wheat wrap',
    price: 11.99,
    emoji: '🌯',
    rating: 4.7,
    reviews: 87,
  },
  {
    id: 4,
    name: 'Golden Fried Chicken',
    description: 'Crispy fried chicken tenders with house-made garlic sauce',
    price: 13.99,
    emoji: '🍗',
    isPopular: true,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 5,
    name: 'Garden Fresh Salad',
    description: 'Mixed greens, seasonal vegetables, and our signature dressing',
    price: 9.99,
    emoji: '🥗',
    rating: 4.6,
    reviews: 62,
  },
  {
    id: 6,
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center and vanilla ice cream',
    price: 7.99,
    emoji: '🍰',
    rating: 4.95,
    reviews: 203,
  },
];

export function FeaturedItemsSection() {
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<number[]>([]);

  const handleAddToCart = (item: typeof featuredItems[0]) => {
    // Convert local item to MenuItem format
    const menuItem = {
      id: item.id.toString(),
      category_id: null,
      name: item.name,
      name_en: null,
      description: item.description,
      description_en: null,
      price: item.price,
      image_url: null,
      is_available: true,
      is_popular: item.isPopular || false,
      display_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addItem(menuItem, 1);
    setAddedItems([...addedItems, item.id]);
    setTimeout(() => {
      setAddedItems(addedItems.filter(id => id !== item.id));
    }, 1500);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ⭐ Featured Favorites
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our most loved and bestselling items. Try them today!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden flex flex-col"
            >
              {/* Badge Area */}
              {(item.isPopular || item.isHot) && (
                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 flex items-center gap-2">
                  {item.isPopular && <Star className="h-4 w-4 fill-current" />}
                  {item.isHot && <Flame className="h-4 w-4" />}
                  <span className="text-sm font-semibold">
                    {item.isPopular && 'Most Popular'}
                    {item.isHot && 'Spicy & Hot'}
                  </span>
                </div>
              )}

              <CardHeader>
                <div className="text-5xl mb-3">{item.emoji}</div>
                <CardTitle className="text-xl">{item.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow flex flex-col">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.rating)
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.rating} ({item.reviews} reviews)
                  </span>
                </div>

                {/* Price and Button */}
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    className={`transition-all ${
                      addedItems.includes(item.id)
                        ? 'bg-green-500 hover:bg-green-600'
                        : ''
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {addedItems.includes(item.id) ? 'Added!' : 'Add'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
