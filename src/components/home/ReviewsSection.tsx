import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGoogleReviews, useBusinessSettings } from '@/hooks/useBusinessData';

export function ReviewsSection() {
  const { data: reviews, isLoading } = useGoogleReviews();
  const { data: settings } = useBusinessSettings();

  if (isLoading) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
      />
    ));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">{renderStars(Math.round(settings?.google_rating || 4.5))}</div>
            <span className="text-2xl font-bold text-foreground">
              {settings?.google_rating || 4.5}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Customer Reviews
          </h2>
          <p className="text-muted-foreground mt-2">
            See what our customers are saying about us on Google
          </p>
        </div>

        {reviews && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {reviews.slice(0, 4).map(review => (
              <Card key={review.id} className="relative">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
                  <div className="flex mb-2">{renderStars(review.rating)}</div>
                  {review.text && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                      "{review.text}"
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-medium text-foreground">{review.author_name}</span>
                    {review.time_description && (
                      <span className="text-xs text-muted-foreground">{review.time_description}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {settings?.google_reviews_url && (
          <div className="text-center mt-8">
            <a
              href={settings.google_reviews_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View all reviews on Google
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
