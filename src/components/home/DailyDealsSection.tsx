import { Tag, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDailyDeals } from '@/hooks/useBusinessData';

export function DailyDealsSection() {
  const { data: deals, isLoading } = useDailyDeals();

  if (isLoading || !deals || deals.length === 0) return null;

  return (
    <section className="py-16 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4">
            <Tag className="h-4 w-4 mr-2" />
            Special Offers
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Daily Deals
          </h2>
          <p className="text-muted-foreground mt-2">
            Limited time offers on your favorite dishes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {deals.map(deal => (
            <Card key={deal.id} className="relative overflow-hidden border-primary/20 hover:border-primary/50 transition-colors">
              {deal.discount_percentage && (
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    <Percent className="h-4 w-4 mr-1" />
                    -{deal.discount_percentage}%
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl text-primary">{deal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {deal.description && (
                  <p className="text-muted-foreground">{deal.description}</p>
                )}
                {deal.discount_amount && (
                  <p className="text-lg font-bold text-primary mt-2">
                    Save ${deal.discount_amount.toFixed(2)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
