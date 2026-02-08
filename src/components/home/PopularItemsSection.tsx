import { Link } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMenuItems } from '@/hooks/useBusinessData';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export function PopularItemsSection() {
  const { data: items, isLoading } = useMenuItems();
  const { addItem } = useCart();

  const popularItems = items?.filter(item => item.is_popular) || [];

  if (isLoading || popularItems.length === 0) return null;

  const handleAddToCart = (item: typeof popularItems[0]) => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">
            <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
            Customer Favorites
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Most Popular Items
          </h2>
          <p className="text-muted-foreground mt-2">
            Our customers' top picks - dishes that everyone loves
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {popularItems.slice(0, 4).map(item => (
            <Card key={item.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="secondary" className="ml-2">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    Popular
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-4 border-t">
                <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                <Button size="sm" onClick={() => handleAddToCart(item)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/menu">
            <Button size="lg" variant="outline">
              View Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
