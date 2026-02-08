import { Link } from 'react-router-dom';
import { ShoppingCart, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusinessSettings } from '@/hooks/useBusinessData';
import { OpenCloseIndicator } from '@/components/shared/OpenCloseIndicator';
import { ReservationModal } from '@/components/shared/ReservationModal';

export function HeroSection() {
  const { data: settings } = useBusinessSettings();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Chinese Food Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-orange-800/30 to-yellow-900/40" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJjaGluZXNlLWZvb2QiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHRleHQgeD0iMjAiIHk9IjYwIiBmb250LXNpemU9IjYwIiBvcGFjaXR5PSIwLjA1Ij7wn42cPC90ZXh0PgogICAgICA8dGV4dCB4PSIxMjAiIHk9IjE0MCIgZm9udC1zaXplPSI1MCIgb3BhY2l0eT0iMC4wNSI+8J+lnyA8L3RleHQ+CiAgICAgIDx0ZXh0IHg9IjYwIiB5PSIxNjAiIGZvbnQtc2l6ZT0iNDAiIG9wYWNpdHk9IjAuMDUiPvCfjZc8L3RleHQ+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjY2hpbmVzZS1mb29kKSIgLz4KPC9zdmc+')] opacity-30" />
      </div>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 text-8xl opacity-20 animate-bounce">🍕</div>
      <div className="absolute bottom-20 right-10 text-7xl opacity-20 animate-pulse">🥙</div>
      <div className="absolute top-1/3 right-1/4 text-6xl opacity-15">🌶️</div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Open/Close Status */}
          <div className="flex justify-center mb-6">
            <div className="bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <OpenCloseIndicator />
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {settings?.name || 'Local Eats Hub'}
          </h1>
          
          <p className="text-xl md:text-2xl text-primary font-medium mb-4">
            {settings?.tagline || 'Fresh & Delicious Food'}
          </p>

          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Discover the finest local cuisine. We bring authentic flavors and fresh ingredients to your table every day.
          </p>

          {/* Location */}
          {settings?.address && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{settings.address}</span>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/menu">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Order Now
              </Button>
            </Link>
            
            <ReservationModal />
            
            {settings?.phone && (
              <a href={`tel:${settings.phone}`}>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 shadow-lg">
                  <Phone className="h-5 w-5 mr-2" />
                  {settings.phone}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
