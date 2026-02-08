import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { useBusinessSettings, useOpeningHours } from '@/hooks/useBusinessData';
import { Button } from '@/components/ui/button';

export function Footer() {
  const { data: settings } = useBusinessSettings();
  const { data: hours } = useOpeningHours();

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const formatTime = (time: string | null) => {
    if (!time) return '';
    return time.slice(0, 5);
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">🍕 {settings?.name || 'Local Eats Hub'}</h3>
            <p className="text-muted-foreground text-sm">
              {settings?.tagline || 'Fresh & Delicious Food'} - Premium local dining experience with authentic flavors.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {settings?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Opening Hours
            </h3>
            {hours && (
              <ul className="space-y-1 text-sm text-muted-foreground">
                {[1, 2, 3, 4, 5, 6, 0].map(day => {
                  const dayHours = hours.find(h => h.day_of_week === day);
                  return (
                    <li key={day} className="flex justify-between">
                      <span>{dayNames[day]}</span>
                      <span>
                        {dayHours?.is_closed
                          ? 'Closed'
                          : `${formatTime(dayHours?.open_time)} - ${formatTime(dayHours?.close_time)}`
                        }
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              <p>© {new Date().getFullYear()} {settings?.name || 'Local Eats Hub'}. All rights reserved.</p>
              <p className="mt-1">Made with ❤️ for food lovers</p>
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground mr-2">Follow us:</span>
              <Button size="icon" variant="ghost" className="h-9 w-9 hover:text-primary" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 hover:text-primary" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 hover:text-primary" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 hover:text-primary" asChild>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
