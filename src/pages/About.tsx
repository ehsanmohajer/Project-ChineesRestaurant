import { ChefHat, Heart, MapPin, Clock, Award, Users, Leaf, TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useBusinessSettings } from '@/hooks/useBusinessData';

export default function About() {
  const { data: settings } = useBusinessSettings();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {settings?.tagline || 'Fresh & Delicious Food - Your Local Dining Destination'}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-6xl mb-4 block">🍕</span>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  {settings?.name || 'Local Eats Hub'}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <div className="text-5xl">🌮</div>
                  <h3 className="text-2xl font-semibold text-foreground">Our Story</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {settings?.description || 
                      'Located in the heart of our community, we serve a diverse selection of delicious pizzas, kebabs, and more. Famous for our generous toppings, crispy wraps, and flavorful salads - our menu caters to all tastes. From classic Margherita to authentic Turkish kebabs, we have something for everyone.'}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We use only fresh, high-quality ingredients, and every dish is made to order to ensure you get the freshest and most delicious food possible. Our experienced kitchen team is passionate about every dish, striving to bring you the best dining experience.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="text-5xl">🥗</div>
                  <h3 className="text-2xl font-semibold text-foreground">Our Promise</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether you're dining in or ordering takeout, we guarantee the quality and temperature of our food. Our restaurant environment is warm and comfortable, with attentive and friendly service.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether you're having a meal with family and friends, conducting business, or enjoying food alone, this is your ideal choice. We offer multiple dining options: dine-in, takeout, and reservation services.
                  </p>
                  <p className="text-muted-foreground leading-relaxed font-semibold text-primary">
                    Come taste our delicious dishes and enjoy quality food in a friendly atmosphere! We look forward to serving you!
                  </p>
                </div>
              </div>

              {/* Image placeholders */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="aspect-square bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-900 dark:to-red-900 rounded-lg flex items-center justify-center text-6xl">
                  🍕
                </div>
                <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-200 dark:from-green-900 dark:to-emerald-900 rounded-lg flex items-center justify-center text-6xl">
                  🥙
                </div>
                <div className="aspect-square bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-900 dark:to-orange-900 rounded-lg flex items-center justify-center text-6xl">
                  🍗
                </div>
                <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-900 rounded-lg flex items-center justify-center text-6xl">
                  🥗
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Fresh Ingredients</h3>
                  <p className="text-sm text-muted-foreground">
                    We use only fresh, high-quality ingredients to ensure the quality and taste of every dish
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Made with Love</h3>
                  <p className="text-sm text-muted-foreground">
                    Every dish is freshly prepared with our passion and dedication
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Prime Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Conveniently located in the city center, easy to visit anytime
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Fast Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Your order is completed quickly and efficiently, saving your precious time
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Quality Guarantee</h3>
                  <p className="text-sm text-muted-foreground">
                    We stand behind every meal with our commitment to excellence
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Family Friendly</h3>
                  <p className="text-sm text-muted-foreground">
                    A welcoming atmosphere perfect for families and groups
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <ChefHat className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Expert Chefs</h3>
                  <p className="text-sm text-muted-foreground">
                    Our experienced team brings authentic flavors to every plate
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Great Value</h3>
                  <p className="text-sm text-muted-foreground">
                    Generous portions and competitive prices for exceptional value
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
