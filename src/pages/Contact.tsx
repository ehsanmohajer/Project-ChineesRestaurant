import { Phone, Mail, MapPin, Clock, ExternalLink, MessageCircle, Navigation } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessSettings, useOpeningHours } from '@/hooks/useBusinessData';
import { OpenCloseIndicator } from '@/components/shared/OpenCloseIndicator';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Contact() {
  const { data: settings } = useBusinessSettings();
  const { data: hours } = useOpeningHours();

  const formatTime = (time: string | null) => {
    if (!time) return '';
    return time.slice(0, 5);
  };

  // Example contact details if not set in database
  const displayPhone = settings?.phone || '+1 (555) 123-4567';
  const displayEmail = settings?.email || 'info@localeats.com';
  const displayAddress = settings?.address || '123 Main Street, Downtown, City Center, 12345';

  const googleMapsUrl = displayAddress 
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to serve you! Call us or visit us at our location.
            </p>
            <div className="flex justify-center mt-6">
              <OpenCloseIndicator />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {displayPhone && (
                    <>
                      <a 
                        href={`tel:${displayPhone}`}
                        className="text-2xl font-bold text-primary hover:underline"
                      >
                        {displayPhone}
                      </a>
                      <p className="text-muted-foreground mt-2">
                        Call us to place an order or ask any questions
                      </p>
                      <a href={`tel:${displayPhone}`}>
                        <Button className="mt-4 w-full">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                      </a>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {displayEmail && (
                    <>
                      <a 
                        href={`mailto:${displayEmail}`}
                        className="text-lg text-primary hover:underline break-all"
                      >
                        {displayEmail}
                      </a>
                      <p className="text-muted-foreground mt-2">
                        Send us an email for inquiries or feedback
                      </p>
                      <a href={`mailto:${displayEmail}`}>
                        <Button variant="outline" className="mt-4 w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                      </a>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {displayAddress && (
                    <>
                      <p className="text-lg text-foreground font-medium">{displayAddress}</p>
                      <p className="text-muted-foreground mt-2">
                        Conveniently located in the city center
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {googleMapsUrl && (
                          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Map
                            </Button>
                          </a>
                        )}
                        {googleMapsUrl && (
                          <a href={`${googleMapsUrl}&navigate=yes`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full">
                              <Navigation className="h-4 w-4 mr-2" />
                              Get Directions
                            </Button>
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Opening Hours */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Opening Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hours && (
                  <ul className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 0].map(day => {
                      const dayHours = hours.find(h => h.day_of_week === day);
                      const today = new Date().getDay();
                      const isToday = day === today;
                      
                      return (
                        <li 
                          key={day} 
                          className={`flex justify-between py-3 px-4 rounded-lg transition-colors ${
                            isToday 
                              ? 'bg-primary/10 border-2 border-primary/30' 
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          <span className={`font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                            {dayNames[day]}
                            {isToday && <span className="ml-2 text-xs font-bold">(Today)</span>}
                          </span>
                          <span className={`${isToday ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
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
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    ⏰ We're currently <span className="font-semibold">open</span> for orders!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Embed */}
          {displayAddress && (
            <div className="max-w-6xl mx-auto">
              <Card className="overflow-hidden shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Find Us Here
                  </CardTitle>
                </CardHeader>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {/* Map placeholder with emoji */}
                  <div className="text-center">
                    <div className="text-8xl mb-4">🗺️</div>
                    <p className="text-muted-foreground text-lg mb-4">{displayAddress}</p>
                    {googleMapsUrl && (
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="lg">
                          <ExternalLink className="h-5 w-5 mr-2" />
                          Open in Google Maps
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
