import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Absolutely delicious food! The flavors are authentic and the portions are generous. Best local restaurant in town!',
    avatar: '👩‍🦰',
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    text: 'Fresh ingredients, fast service, and amazing taste. I recommend this place to everyone I know.',
    avatar: '👨‍💼',
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    rating: 5,
    text: 'Great variety of dishes and friendly staff. The quality never disappoints. Definitely coming back!',
    avatar: '👩‍🍳',
  },
  {
    id: 4,
    name: 'David Kim',
    rating: 5,
    text: 'Perfect for family dinners and date nights. The ambiance is warm and welcoming.',
    avatar: '👨‍🦱',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers who love our food
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
