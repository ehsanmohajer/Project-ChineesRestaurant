import { useState } from 'react';
import { Plus, Minus, Star, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMenuCategories, useMenuItems } from '@/hooks/useBusinessData';
import { useCart } from '@/contexts/CartContext';
import { MenuItem } from '@/types/database';
import { toast } from 'sonner';

function MenuItemCard({ item }: { item: MenuItem }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item, quantity);
    toast.success(`${quantity}x ${item.name} added to cart`);
    setQuantity(1);
  };

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          {item.is_popular && (
            <Badge variant="secondary" className="shrink-0">
              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
              Popular
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        <div className="flex items-center justify-between w-full">
          <span className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</span>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Menu() {
  const { data: categories, isLoading: categoriesLoading } = useMenuCategories();
  const { data: items, isLoading: itemsLoading } = useMenuItems();

  const isLoading = categoriesLoading || itemsLoading;

  const getItemsByCategory = (categoryId: string) => {
    return items?.filter(item => item.category_id === categoryId) || [];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Menu</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse selection of delicious dishes crafted with fresh ingredients
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading menu...</p>
            </div>
          ) : categories && categories.length > 0 ? (
            <Tabs defaultValue={categories[0].id} className="w-full">
              <TabsList className="flex flex-wrap justify-center gap-2 mb-8 h-auto bg-transparent">
                {categories.map(category => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map(category => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getItemsByCategory(category.id).map(item => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                  {getItemsByCategory(category.id).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No items available in this category
                    </p>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              Menu not available at the moment
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
