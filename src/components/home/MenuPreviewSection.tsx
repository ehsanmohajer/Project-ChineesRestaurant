import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMenuItems } from '@/hooks/useBusinessData';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export function MenuPreviewSection() {
  const { data: items, isLoading } = useMenuItems();
  const { addItem } = useCart();

  if (isLoading || !items || items.length === 0) return null;

  // Show first 6 items
  const previewItems = items.slice(0, 6);

  const handleAddToCart = (item: typeof items[0]) => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Menu
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse selection of delicious dishes crafted with fresh ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {previewItems.map(item => (
            <Card key={item.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  {item.is_popular && (
                    <Badge variant="secondary" className="ml-2">
                      Popular
                    </Badge>
                  )}
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
            <Button size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              View Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
